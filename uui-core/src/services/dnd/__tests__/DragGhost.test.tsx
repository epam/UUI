import * as React from 'react';
import { screen, waitFor, act } from '@epam/uui-test-utils';
import { DragGhost } from '../DragGhost';
import { DndContext } from '../DndContext';
import { UuiContext } from '../../UuiContext';
import { ILayoutContext, UuiContexts } from '../../../types';
import { renderWithContextAsync } from '@epam/uui-test-utils';

jest.mock('../../../helpers/ssr', () => ({
    isClientSide: true,
}));

jest.mock('../../../helpers/getOffset', () => ({
    getOffset: jest.fn(() => ({
        left: 100,
        top: 200,
    })),
}));

jest.mock('../../../helpers/events', () => ({
    getScrollParentOfEventTarget: jest.fn(() => null),
}));

describe('DragGhost', () => {
    let mockDndContext: DndContext;
    let mockUuiContext: UuiContexts;
    let mockLayoutContext: {
        getLayer: jest.Mock;
        releaseLayer: jest.Mock;
        getPortalRoot?: ILayoutContext['getPortalRoot'];
        getPortalRootId?: ILayoutContext['getPortalRootId'];
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockDndContext = new DndContext();
        mockDndContext.init();

        mockLayoutContext = {
            getLayer: jest.fn(() => ({ zIndex: 1000 })),
            releaseLayer: jest.fn(),
        };

        mockUuiContext = {
            uuiDnD: mockDndContext,
            uuiLayout: mockLayoutContext,
        } as unknown as UuiContexts;
    });

    afterEach(() => {
        mockDndContext.destroyContext();
    });

    const createDragGhost = async () => {
        const wrapper: ({ children }: { children?: React.ReactNode }) => React.ReactElement = ({ children }) => (
            <UuiContext.Provider value={ mockUuiContext as any }>
                {children}
            </UuiContext.Provider>
        );

        const result = await renderWithContextAsync(
            <DragGhost />,
            { wrapper },
        );

        return { result, mockLayoutContext };
    };

    const mockMouseCoords = {
        mousePageX: 150,
        mousePageY: 250,
        mouseDx: 0,
        mouseDy: 0,
        mouseDxSmooth: 0,
        mouseDySmooth: 0,
        mouseDownPageX: 120,
        mouseDownPageY: 220,
        buttons: 1,
    };

    const setupDragTest = (ghostContent: string = 'Ghost Content') => {
        const mockRenderGhost = jest.fn(() => <div>{ghostContent}</div>);
        const mockNode = document.createElement('div');
        Object.defineProperty(mockNode, 'offsetWidth', { value: 300, writable: true });

        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = jest.fn(() => ({
            marginLeft: '10px',
            marginRight: '20px',
            marginTop: '15px',
            marginBottom: '25px',
        } as any));

        jest.spyOn(mockDndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);

        return {
            mockRenderGhost,
            mockNode,
            originalGetComputedStyle,
            cleanup: () => {
                window.getComputedStyle = originalGetComputedStyle;
            },
        };
    };

    const setupDragWithLayer = async (ghostContent: string = 'Ghost') => {
        const { result } = await createDragGhost();
        const { mockRenderGhost, mockNode, cleanup } = setupDragTest(ghostContent);
        const mockLayer = { zIndex: 1000 };

        await waitFor(() => {
            expect(result.container).toBeTruthy();
        });

        mockLayoutContext.getLayer.mockReturnValue(mockLayer);
        await act(async () => {
            mockDndContext.startDrag(mockNode, { id: 1 }, mockRenderGhost);
        });

        await waitFor(() => {
            expect(mockLayoutContext.getLayer).toHaveBeenCalled();
        }, { timeout: 1000 });

        return { result, mockLayoutContext, mockRenderGhost, mockNode, mockLayer, cleanup };
    };

    describe('rendering', () => {
        it('should not render when not dragging', async () => {
            await createDragGhost();

            expect(screen.queryByText('Ghost Content')).not.toBeInTheDocument();
        });

        it('should render ghost when dragging starts', async () => {
            const { result } = await createDragGhost();
            const { mockRenderGhost, mockNode, cleanup } = setupDragTest();

            await waitFor(() => {
                expect(result.container).toBeTruthy();
            });

            await act(async () => {
                mockDndContext.startDrag(mockNode, { id: 1 }, mockRenderGhost);
            });

            await waitFor(() => {
                expect(mockRenderGhost).toHaveBeenCalled();
            }, { timeout: 1000 });

            cleanup();
        });

        it('should position ghost correctly', async () => {
            await createDragGhost();
            const { mockRenderGhost, mockNode, cleanup } = setupDragTest();

            await act(async () => {
                mockDndContext.startDrag(mockNode, { id: 1 }, mockRenderGhost);
            });

            await waitFor(() => {
                const ghostElement = screen.queryByText('Ghost Content');
                expect(ghostElement).toBeInTheDocument();
            }, { timeout: 1000 });

            cleanup();
        });
    });

    describe('layout layer management', () => {
        it('should get layer when dragging starts', async () => {
            const { cleanup } = await setupDragWithLayer();

            cleanup();
        });

        it('should release layer when dragging ends', async () => {
            const { mockLayer, cleanup } = await setupDragWithLayer();

            await act(async () => {
                mockDndContext.endDrag();
            });

            await waitFor(() => {
                expect(mockLayoutContext.releaseLayer).toHaveBeenCalledWith(mockLayer);
            }, { timeout: 1000 });

            cleanup();
        });

        it('should release layer on unmount', async () => {
            const { result, mockLayer, cleanup } = await setupDragWithLayer();

            result.unmount();

            expect(mockLayoutContext.releaseLayer).toHaveBeenCalledWith(mockLayer);

            cleanup();
        });
    });

    describe('context subscription', () => {
        it('should subscribe to context updates', async () => {
            const subscribeSpy = jest.spyOn(mockDndContext, 'subscribe');
            const { result } = await createDragGhost();

            await waitFor(() => {
                expect(result.container).toBeTruthy();
            });

            expect(subscribeSpy).toHaveBeenCalled();
        });

        it('should unsubscribe on unmount', async () => {
            const subscribeSpy = jest.spyOn(mockDndContext, 'subscribe');
            const unsubscribeSpy = jest.spyOn(mockDndContext, 'unsubscribe');
            const { result } = await createDragGhost();

            await waitFor(() => {
                expect(result.container).toBeTruthy();
            });

            expect(subscribeSpy).toHaveBeenCalled();

            result.unmount();

            expect(unsubscribeSpy).toHaveBeenCalled();
        });
    });
});

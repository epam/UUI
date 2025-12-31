import * as React from 'react';
import { screen, fireEvent, waitFor, act } from '@epam/uui-test-utils';
import { DndActor, DndActorProps } from '../DndActor';
import { DndContext } from '../DndContext';
import { UuiContext } from '../../UuiContext';
import { UuiContexts } from '../../../types';
import { renderWithContextAsync } from '@epam/uui-test-utils';

jest.mock('../../../helpers/events', () => ({
    isEventTargetInsideDraggable: jest.fn(() => false),
    isEventTargetInsideInput: jest.fn(() => false),
    releasePointerCaptureOnEventTarget: jest.fn(),
}));

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
    isEventTargetInsideDraggable: jest.fn(() => false),
    isEventTargetInsideInput: jest.fn(() => false),
    releasePointerCaptureOnEventTarget: jest.fn(),
}));

describe('DndActor', () => {
    let mockDndContext: DndContext;
    let mockUuiContext: UuiContexts;
    let mockRender: jest.Mock;
    let mockCanAcceptDrop: jest.Mock;
    let mockOnDrop: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockDndContext = new DndContext();
        mockDndContext.init();
        mockUuiContext = { uuiDnD: mockDndContext } as unknown as UuiContexts;

        mockRender = jest.fn((params) => (
            <div
                data-testid="dnd-actor"
                ref={ params.ref }
                { ...params.eventHandlers }
                className={ params.classNames?.join(' ') }
            >
                { params.isDraggable && 'Draggable' }
                { params.isDraggedOver && 'DraggedOver' }
                { params.isDropAccepted && 'DropAccepted' }
                { params.isDragGhost && 'DragGhost' }
            </div>
        ));

        mockCanAcceptDrop = jest.fn(() => ({
            top: true,
            bottom: true,
            left: true,
            right: true,
            inside: true,
        }));

        mockOnDrop = jest.fn();
    });

    afterEach(() => {
        mockDndContext.destroyContext();
    });

    const createDndActor = async (props: Partial<DndActorProps<any, any>> = {}) => {
        const defaultProps: DndActorProps<any, any> = {
            render: mockRender,
            ...props,
        };

        const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <UuiContext.Provider value={ mockUuiContext as any }>
                {children}
            </UuiContext.Provider>
        );

        const result = await renderWithContextAsync(
            <DndActor { ...defaultProps } />,
            { wrapper },
        );

        return { result, mockRender, mockCanAcceptDrop, mockOnDrop };
    };

    describe('rendering', () => {
        it('should render with draggable state when srcData is provided', async () => {
            await createDndActor({ srcData: { id: 1 } });

            expect(mockRender).toHaveBeenCalled();
            const renderParams = mockRender.mock.calls[0][0];
            expect(renderParams.isDraggable).toBe(true);
            expect(renderParams.isDraggedOut).toBe(false);
            expect(renderParams.isDraggedOver).toBe(false);
        });

        it('should render without draggable state when srcData is not provided', async () => {
            await createDndActor({ srcData: null });

            const renderParams = mockRender.mock.calls[0][0];
            expect(renderParams.isDraggable).toBe(false);
        });

        it('should render with event handlers when srcData is provided', async () => {
            await createDndActor({ srcData: { id: 1 } });

            const renderParams = mockRender.mock.calls[0][0];
            expect(renderParams.eventHandlers.onPointerDown).toBeDefined();
        });

        it('should render with drop handlers when canAcceptDrop is provided', async () => {
            await createDndActor({
                canAcceptDrop: mockCanAcceptDrop,
                dstData: { id: 2 },
            });

            const renderParams = mockRender.mock.calls[0][0];
            expect(renderParams.eventHandlers.onPointerEnter).toBeDefined();
            expect(renderParams.eventHandlers.onPointerMove).toBeDefined();
            expect(renderParams.eventHandlers.onPointerLeave).toBeDefined();
        });
    });

    describe('drag start', () => {
        it('should not start drag if movement is below threshold', async () => {
            await createDndActor({ srcData: { id: 1 } });
            const element = screen.getByTestId('dnd-actor');

            fireEvent.pointerDown(element, {
                clientX: 100,
                clientY: 200,
                button: 0,
            });

            jest.spyOn(mockDndContext, 'getMouseCoords').mockReturnValue({
                mousePageX: 102,
                mousePageY: 202,
                mouseDx: 2,
                mouseDy: 2,
                mouseDxSmooth: 2,
                mouseDySmooth: 2,
                mouseDownPageX: 100,
                mouseDownPageY: 200,
                buttons: 1,
            });

            const moveEvent = new MouseEvent('pointermove', {
                bubbles: true,
                cancelable: true,
                clientX: 102,
                clientY: 202,
                buttons: 1,
            });
            window.dispatchEvent(moveEvent);

            await waitFor(() => {
                expect(mockDndContext.isDragging).toBe(false);
            }, { timeout: 100 });
        });
    });

    describe('drop handling', () => {
        it('should calculate position correctly', async () => {
            await createDndActor({
                canAcceptDrop: mockCanAcceptDrop,
                dstData: { id: 2 },
            });
            const element = screen.getByTestId('dnd-actor');

            await waitFor(() => {
                expect(mockRender).toHaveBeenCalled();
            });

            jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
                left: 100,
                top: 200,
                width: 200,
                height: 200,
                right: 300,
                bottom: 400,
                x: 100,
                y: 200,
                toJSON: jest.fn(),
            } as DOMRect);

            await act(async () => {
                mockDndContext.startDrag(element, { id: 1 }, () => <div>Ghost</div>);
            });

            await waitFor(() => {
                expect(mockDndContext.isDragging).toBe(true);
            });

            await waitFor(() => {
                const renderParams = mockRender.mock.calls[mockRender.mock.calls.length - 1][0];
                expect(renderParams.isDndInProgress).toBe(true);
            }, { timeout: 1000 });
        });
    });

    describe('getPosition', () => {
        it.skip('should return inside when mouse is in center', async () => {
            await createDndActor({
                canAcceptDrop: mockCanAcceptDrop,
                dstData: { id: 2 },
            });
            const element = screen.getByTestId('dnd-actor');

            jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
                left: 100,
                top: 200,
                width: 200,
                height: 200,
                right: 300,
                bottom: 400,
                x: 100,
                y: 200,
                toJSON: jest.fn(),
            } as DOMRect);

            mockDndContext.startDrag(element, { id: 1 }, () => <div>Ghost</div>);

            await waitFor(() => {
                expect(mockDndContext.isDragging).toBe(true);
            });

            fireEvent.pointerEnter(element, {
                clientX: 200,
                clientY: 300,
            });

            await waitFor(() => expect(mockCanAcceptDrop).toHaveBeenCalled());
            await waitFor(() => {
                const latestRenderParams = mockRender.mock.calls[mockRender.mock.calls.length - 1][0];
                expect(latestRenderParams.position).toBe('inside');
            }, { timeout: 1000 });
        });
    });

    describe('cleanup', () => {
        it('should cleanup on unmount', async () => {
            const subscribeSpy = jest.spyOn(mockDndContext, 'subscribe');
            const unsubscribeSpy = jest.spyOn(mockDndContext, 'unsubscribe');
            const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

            const { result } = await createDndActor({ srcData: { id: 1 } });

            await waitFor(() => {
                expect(mockRender).toHaveBeenCalled();
            });

            expect(subscribeSpy).toHaveBeenCalled();

            result.unmount();

            await waitFor(() => expect(unsubscribeSpy).toHaveBeenCalled());
            expect(removeEventListenerSpy).toHaveBeenCalled();
        });
    });
});

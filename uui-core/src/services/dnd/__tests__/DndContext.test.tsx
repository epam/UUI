import React from 'react';
import { DndContext, TMouseCoords } from '../DndContext';
import { waitFor } from '@epam/uui-test-utils';

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

describe('DndContext', () => {
    let dndContext: DndContext;
    let mockNode: HTMLElement;
    let mockRenderGhost: jest.Mock;

    const mockMouseCoords: TMouseCoords = {
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

    beforeEach(() => {
        jest.clearAllMocks();
        dndContext = new DndContext();
        mockNode = document.createElement('div');
        Object.defineProperty(mockNode, 'offsetWidth', { value: 300, writable: true });
        Object.defineProperty(mockNode, 'offsetHeight', { value: 400, writable: true });
        mockRenderGhost = jest.fn(() => <div>Ghost</div>);
        document.body.appendChild(mockNode);

        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = jest.fn((el: any) => {
            const style = originalGetComputedStyle(el);
            return {
                ...style,
                marginLeft: '10px',
                marginRight: '20px',
                marginTop: '15px',
                marginBottom: '25px',
            } as CSSStyleDeclaration;
        });
    });

    afterEach(() => {
        dndContext.destroyContext();
        document.body.removeChild(mockNode);
        const style = document.getElementById('uui-drag-cursor-override');
        if (style) {
            document.head.removeChild(style);
        }
        document.body.classList.remove('uui-dragging');
    });

    describe('init', () => {
        it('should initialize context and mouse coords service', () => {
            dndContext.init();
            expect(dndContext.getMouseCoords).toBeDefined();
            dndContext.destroyContext();
        });
    });

    describe('getMouseCoords', () => {
        it('should return mouse coordinates', () => {
            dndContext.init();
            const coords = dndContext.getMouseCoords();
            expect(coords).toHaveProperty('mousePageX');
            expect(coords).toHaveProperty('mousePageY');
            expect(coords).toHaveProperty('mouseDx');
            expect(coords).toHaveProperty('mouseDy');
            expect(coords).toHaveProperty('mouseDxSmooth');
            expect(coords).toHaveProperty('mouseDySmooth');
            expect(coords).toHaveProperty('mouseDownPageX');
            expect(coords).toHaveProperty('mouseDownPageY');
            expect(coords).toHaveProperty('buttons');
            dndContext.destroyContext();
        });
    });

    describe('startDrag', () => {
        beforeEach(() => {
            dndContext.init();
        });

        it('should set drag state and calculate ghost offset', () => {
            const mockData = { id: 1, name: 'test' };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);

            dndContext.startDrag(mockNode, mockData, mockRenderGhost);

            expect(dndContext.isDragging).toBe(true);
            expect(dndContext.dragData).toEqual(mockData);
        });

        it('should inject cursor override styles', () => {
            const mockData = { id: 1 };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);

            dndContext.startDrag(mockNode, mockData, mockRenderGhost);

            const style = document.getElementById('uui-drag-cursor-override');
            expect(style).toBeTruthy();
            expect(document.body.classList.contains('uui-dragging')).toBe(true);
        });

        it('should dispatch dragstart event', () => {
            const mockData = { id: 1 };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);
            const dispatchEventSpy = jest.spyOn(document.body, 'dispatchEvent');

            dndContext.startDrag(mockNode, mockData, mockRenderGhost);

            expect(dispatchEventSpy).toHaveBeenCalled();
            const event = dispatchEventSpy.mock.calls[0][0];
            expect(event.type).toBe('dragstart');
        });

        it('should update subscribers with drag state', () => {
            const mockData = { id: 1 };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);
            const handler = jest.fn();
            dndContext.subscribe(handler);

            dndContext.startDrag(mockNode, mockData, mockRenderGhost);

            expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({
                    isDragging: true,
                    ghostOffsetX: expect.any(Number),
                    ghostOffsetY: expect.any(Number),
                    ghostWidth: expect.any(Number),
                    renderGhost: mockRenderGhost,
                }),
            );
        });
    });

    describe('endDrag', () => {
        beforeEach(() => {
            dndContext.init();
        });

        it('should reset drag state', async () => {
            const mockData = { id: 1 };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);
            dndContext.startDrag(mockNode, mockData, mockRenderGhost);

            dndContext.endDrag();

            await waitFor(() => expect(dndContext.isDragging).toBe(false));
            expect(dndContext.dragData).toBeNull();
        });

        it('should cleanup cursor override styles', async () => {
            const mockData = { id: 1 };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);
            dndContext.startDrag(mockNode, mockData, mockRenderGhost);

            dndContext.endDrag();

            await waitFor(() => expect(document.getElementById('uui-drag-cursor-override')).toBeFalsy());
            expect(document.body.classList.contains('uui-dragging')).toBe(false);
        });

        it('should update subscribers with end drag state', async () => {
            const mockData = { id: 1 };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);
            const handler = jest.fn();
            dndContext.subscribe(handler);
            dndContext.startDrag(mockNode, mockData, mockRenderGhost);

            dndContext.endDrag();

            await waitFor(() => expect(handler).toHaveBeenCalledWith(
                expect.objectContaining({
                    isDragging: false,
                }),
            ));
        });

        it('should not do anything if not dragging', () => {
            const handler = jest.fn();
            dndContext.subscribe(handler);

            dndContext.endDrag();

            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('windowPointerUpHandler', () => {
        beforeEach(() => {
            dndContext.init();
        });

        it('should cleanup cursor and end drag on pointer up', async () => {
            const mockData = { id: 1 };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);
            dndContext.startDrag(mockNode, mockData, mockRenderGhost);
            const endDragSpy = jest.spyOn(dndContext, 'endDrag');

            const event = new MouseEvent('pointerup', { bubbles: true });
            window.dispatchEvent(event);

            await waitFor(() => expect(endDragSpy).toHaveBeenCalled());
        });
    });

    describe('windowPointerMoveHandler', () => {
        beforeEach(() => {
            dndContext.init();
        });

        it('should set scroll nodes when dragging', () => {
            const mockData = { id: 1 };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);
            const scrollNode = document.createElement('div');
            const { getScrollParentOfEventTarget } = require('../../../helpers/events');
            getScrollParentOfEventTarget.mockReturnValueOnce(scrollNode).mockReturnValueOnce(scrollNode);
            dndContext.startDrag(mockNode, mockData, mockRenderGhost);

            const event = new MouseEvent('pointermove', { bubbles: true });
            window.dispatchEvent(event);

            expect(dndContext.xScrollNode).toBe(scrollNode);
            expect(dndContext.yScrollNode).toBe(scrollNode);
        });
    });

    describe('destroyContext', () => {
        it('should cleanup event listeners and mouse coords service', () => {
            dndContext.init();
            const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

            dndContext.destroyContext();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
        });

        it('should cleanup cursor override on destroy', () => {
            dndContext.init();
            const mockData = { id: 1 };
            jest.spyOn(dndContext, 'getMouseCoords').mockReturnValue(mockMouseCoords);
            dndContext.startDrag(mockNode, mockData, mockRenderGhost);

            dndContext.destroyContext();

            const style = document.getElementById('uui-drag-cursor-override');
            expect(style).toBeFalsy();
            expect(document.body.classList.contains('uui-dragging')).toBe(false);
        });
    });
});

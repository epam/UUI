import { isClientSide } from '../../helpers/ssr';
import { getOffset } from '../../helpers/getOffset';
import { getScrollParentOfEventTarget } from '../../helpers/events';
import * as React from 'react';
import { IDndContext } from '../../types/contexts';
import { BaseContext } from '../BaseContext';
import { DndActorRenderParams } from '../../types';

const maxScrollSpeed = 2000; // px/second

export interface PlaceholderData {
    placeholderRowProps: { indent: number, depth: number };
}

export interface DndContextState {
    isDragging: boolean;
    ghostOffsetX?: number;
    ghostOffsetY?: number;
    ghostWidth?: number;

    renderGhost?(): React.ReactNode;
    renderPlaceholder?(params: DndActorRenderParams & PlaceholderData): React.ReactNode;
    placeholderValue?: any;
}

export class DndContext extends BaseContext<DndContextState> implements IDndContext {
    public isDragging = false;
    public dragData: any;
    private scrollZoneSize = 85;
    private ghostOffsetX: number = 0;
    private ghostOffsetY: number = 0;
    private ghostWidth: number = 300;
    private renderGhostCallback: () => React.ReactNode = null;
    private renderPlaceholderCallback: (params: DndActorRenderParams & PlaceholderData) => React.ReactNode = null;
    private lastScrollTime = new Date().getTime();
    private mouseCoordsService = new MouseCoordsService();

    init() {
        super.init();

        if (isClientSide) {
            this.mouseCoordsService.init();
            window.addEventListener('pointermove', this.windowPointerMoveHandler);
            window.addEventListener('pointerup', this.windowPointerUpHandler);
        }
    }

    public destroyContext() {
        super.destroyContext();
        if (isClientSide) {
            window.removeEventListener('pointermove', this.windowPointerMoveHandler);
            window.removeEventListener('pointerup', this.windowPointerUpHandler);
            this.mouseCoordsService.destroy();
        }
    }

    public getMouseCoords = (): TMouseCoords => {
        return this.mouseCoordsService.getCoords();
    };

    public startDrag(node: HTMLElement, data: {}, renderGhost: () => React.ReactNode, renderPlaceholder?: (params: DndActorRenderParams & PlaceholderData) => React.ReactNode) {
        const offset = getOffset(node);
        const mouseCoords = this.mouseCoordsService.getCoords();

        this.ghostOffsetX = offset.left - mouseCoords.mouseDownPageX - parseInt(getComputedStyle(node, null).marginLeft, 10);
        this.ghostOffsetY = offset.top - mouseCoords.mouseDownPageY - parseInt(getComputedStyle(node, null).marginTop, 10);
        this.ghostWidth = node.offsetWidth + parseInt(getComputedStyle(node, null).marginLeft, 10) + parseInt(getComputedStyle(node, null).marginRight, 10);

        this.dragData = data;
        this.renderGhostCallback = renderGhost;
        this.renderPlaceholderCallback = renderPlaceholder;

        // prepare scroll
        this.lastScrollTime = new Date().getTime();
        isClientSide && window.requestAnimationFrame(() => this.scrollWindow());

        this.update({
            isDragging: true,
            ghostOffsetX: this.ghostOffsetX,
            ghostOffsetY: this.ghostOffsetY,
            ghostWidth: this.ghostWidth,
            renderGhost: this.renderGhostCallback,
            renderPlaceholder: this.renderPlaceholderCallback,
        });
        this.isDragging = true;

        // To close dropdowns
        const ev = document.createEvent('Events');
        ev.initEvent('dragstart', true, false);
        document.body.dispatchEvent(ev);
    }

    public endDrag() {
        if (!this.isDragging) {
            return;
        }

        new Promise<void>((res) => {
            this.update({ isDragging: false });
            res();
        }).then(() => {
            this.renderGhostCallback = null;
            this.renderPlaceholderCallback = null;
            this.dragData = null;
            this.isDragging = false;
        });
    }

    xScrollNode: HTMLElement = null;
    yScrollNode: HTMLElement = null;
    private windowPointerMoveHandler = (e: PointerEvent) => {
        if (this.isDragging) {
            this.xScrollNode = getScrollParentOfEventTarget(e, 'x');
            this.yScrollNode = getScrollParentOfEventTarget(e, 'y');
        }
    };

    private windowPointerUpHandler = () => {
        this.endDrag();
    };

    private getScrollStep(nodeSize: number, nodeOffset: number, nodeScroll: number, mousePageCoord: number, mouseDelta: number) {
        const now = new Date().getTime();

        const startToMouse = mousePageCoord - nodeOffset;
        const endToMouse = nodeOffset + nodeSize - mousePageCoord;
        const scrollZoneSize = Math.min(this.scrollZoneSize, nodeSize / 4);

        let scrollDir = 0;

        // left/up
        if (mouseDelta < 0.5) {
            scrollDir = -Math.max(0, (scrollZoneSize - startToMouse) / scrollZoneSize);
        }

        // right/down
        if (mouseDelta > 0.5) {
            scrollDir = Math.max(0, (scrollZoneSize - endToMouse) / scrollZoneSize);
        }

        if (scrollDir !== 0) {
            const step = ((now - this.lastScrollTime) / 1000) * maxScrollSpeed * scrollDir;
            return nodeScroll + step;
        }
    }

    private scrollWindow() {
        const now = new Date().getTime();
        const mouseCoords = this.mouseCoordsService.getCoords();

        if (this.xScrollNode) {
            const scrollX = this.getScrollStep(
                this.xScrollNode.offsetWidth,
                getOffset(this.xScrollNode).left,
                this.xScrollNode.scrollLeft,
                mouseCoords.mousePageX,
                mouseCoords.mouseDxSmooth,
            );

            if (scrollX !== undefined && scrollX !== 0) {
                this.xScrollNode.scrollLeft = scrollX;
            }
        }

        if (this.yScrollNode) {
            const scrollY = this.getScrollStep(
                this.yScrollNode.offsetHeight,
                getOffset(this.yScrollNode).top,
                this.yScrollNode.scrollTop,
                mouseCoords.mousePageY,
                mouseCoords.mouseDySmooth,
            );

            if (scrollY !== undefined && scrollY !== 0) {
                this.yScrollNode.scrollTop = scrollY;
            }
        }

        this.lastScrollTime = now;

        if (this.isDragging) {
            window.requestAnimationFrame(() => this.scrollWindow());
        }
    }
}

export type TMouseCoords = {
    mousePageX: number,
    mousePageY: number,
    mouseDx: number,
    mouseDy: number,
    mouseDxSmooth: number,
    mouseDySmooth: number,
    mouseDownPageX: number,
    mouseDownPageY: number,
    buttons: number,
};

class MouseCoordsService {
    private _prevMouseCoords: TMouseCoords;

    init = () => {
        this._prevMouseCoords = {
            mousePageX: 0,
            mousePageY: 0,
            mouseDx: 0,
            mouseDy: 0,
            mouseDxSmooth: 0,
            mouseDySmooth: 0,
            mouseDownPageX: 0,
            mouseDownPageY: 0,
            buttons: 0,
        };
        if (isClientSide) {
            document.addEventListener('pointermove', this.handleMouseCoordsChange);
        }
    };

    public destroy() {
        if (isClientSide) {
            document.removeEventListener('pointermove', this.handleMouseCoordsChange);
        }
    }

    private handleMouseCoordsChange = (e: PointerEvent) => {
        this._prevMouseCoords = getMouseCoordsFromPointerEvent(e, this._prevMouseCoords);
    };

    public getCoords = () => {
        return this._prevMouseCoords;
    };
}

function getMouseCoordsFromPointerEvent(e: PointerEvent, prevCoords: TMouseCoords): TMouseCoords {
    const mouseDx = e.pageX - prevCoords.mousePageX;
    const mouseDy = e.pageY - prevCoords.mousePageY;
    const mouseDxSmooth = prevCoords.mouseDxSmooth * 0.8 + mouseDx * 0.2;
    const mouseDySmooth = prevCoords.mouseDySmooth * 0.8 + mouseDy * 0.2;
    const mousePageX = e.pageX;
    const mousePageY = e.pageY;
    const result: TMouseCoords = {
        mouseDx,
        mouseDy,
        mouseDxSmooth,
        mouseDySmooth,
        mousePageX,
        mousePageY,
        buttons: e.buttons,
        mouseDownPageX: prevCoords.mouseDownPageX || 0,
        mouseDownPageY: prevCoords.mouseDownPageY || 0,
    };
    if ((prevCoords.buttons === 0 && e.buttons > 0) || e.pointerType === 'touch') {
        result.mouseDownPageX = mousePageX;
        result.mouseDownPageY = mousePageY;
    }
    return result;
}

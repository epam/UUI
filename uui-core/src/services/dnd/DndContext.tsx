import { isClientSide } from '../../helpers/ssr';
import { getOffset } from '../../helpers/getOffset';
import { getScrollParentOfEventTarget } from '../../helpers/events';
import * as React from 'react';
import { IDndContext, IDraggingOverInfo } from '../../types/contexts';
import { BaseContext } from '../BaseContext';
import { MouseCoordsService, TMouseCoords } from './MouseCoordsService';
import { DndRowData, DndRowsDataService } from './DndRowsDataService';

const maxScrollSpeed = 2000; // px/second

export interface DndContextState<TId = any> {
    isDragging: boolean;
    draggingOverInfo?: IDraggingOverInfo<TId> | null;
    ghostOffsetX?: number;
    ghostOffsetY?: number;
    ghostWidth?: number;

    renderGhost?(): React.ReactNode;
}

export class DndContext<TId = any, TSrcData = any, TDstData = any> extends BaseContext<DndContextState<TId>> implements IDndContext {
    public isDragging = false;
    public draggingOverInfo: IDraggingOverInfo<TId> | null = null;
    public dragData: TSrcData;
    private scrollZoneSize = 85;
    private ghostOffsetX: number = 0;
    private ghostOffsetY: number = 0;
    private ghostWidth: number = 300;
    private renderGhostCallback: () => React.ReactNode = null;
    private lastScrollTime = new Date().getTime();
    private mouseCoordsService = new MouseCoordsService();
    private rowsDataService = new DndRowsDataService();

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
        this.rowsDataService.destroy();
    }

    public getMouseCoords = (): TMouseCoords => {
        return this.mouseCoordsService.getCoords();
    };
    
    public setDndRowData(data: DndRowData<TId, TSrcData, TDstData>) {
        this.rowsDataService.setDndRowData(data);
    }

    public getDndRowData(id: TId) {
        return this.rowsDataService.getDndRowData(id);
    }

    public setDraggingOverInfo(info: IDraggingOverInfo<TId>) {
        this.update({ isDragging: this.isDragging, draggingOverInfo: info });
    }

    public startDrag(node: HTMLElement, data: TSrcData, renderGhost: () => React.ReactNode) {
        const offset = getOffset(node);
        const mouseCoords = this.mouseCoordsService.getCoords();

        this.ghostOffsetX = offset.left - mouseCoords.mouseDownPageX - parseInt(getComputedStyle(node, null).marginLeft, 10);
        this.ghostOffsetY = offset.top - mouseCoords.mouseDownPageY - parseInt(getComputedStyle(node, null).marginTop, 10);
        this.ghostWidth = node.offsetWidth + parseInt(getComputedStyle(node, null).marginLeft, 10) + parseInt(getComputedStyle(node, null).marginRight, 10);

        this.dragData = data;
        this.renderGhostCallback = renderGhost;

        // prepare scroll
        this.lastScrollTime = new Date().getTime();
        isClientSide && window.requestAnimationFrame(() => this.scrollWindow());

        this.update({
            isDragging: true,
            draggingOverInfo: null,
            ghostOffsetX: this.ghostOffsetX,
            ghostOffsetY: this.ghostOffsetY,
            ghostWidth: this.ghostWidth,
            renderGhost: this.renderGhostCallback,
        });
        this.isDragging = true;

        // To close dropdowns
        const ev = document.createEvent('Events');
        ev.initEvent('dragstart', true, false);
        document.body.dispatchEvent(ev);
        document.body.style.cursor = 'grabbing';
    }

    public endDrag() {
        if (!this.isDragging) {
            return;
        }

        new Promise<void>((res) => {
            this.update({ isDragging: false, draggingOverInfo: null });
            res();
        }).then(() => {
            this.renderGhostCallback = null;
            this.dragData = null;
            this.isDragging = false;
            document.body.style.cursor = 'default';
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

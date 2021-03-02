import { mouseCoords, getOffset } from '../../helpers';
import * as React from 'react';
import { IDndContext, DndContextState } from '../../types';
import { BaseContext } from '../BaseContext';

let topOffset = 50;
let maxScrollSpeed = 2000; // px/second

export class DndContext extends BaseContext<DndContextState> implements IDndContext {
    public isDragging = false;
    public dragData: any;

    private scrollZoneSize = 85;
    private ghostOffsetX: number = 0;
    private ghostOffsetY: number = 0;
    private ghostWidth: number = 300;
    private renderGhostCallback: () => React.ReactNode = null;
    private lastScrollTime = new Date().getTime();

    constructor() {
        super();
        window.addEventListener('mousemove', this.windowMouseMoveHandler);
        window.addEventListener('mouseup', this.windowMouseUpHandler);
    }

    public startDrag(node: HTMLElement, data: {}, renderGhost: () => React.ReactNode) {
        const offset = getOffset(node);

        this.ghostOffsetX = offset.left - mouseCoords.mouseDownPageX - parseInt(getComputedStyle(node, null).marginLeft, 10);
        this.ghostOffsetY = offset.top - mouseCoords.mouseDownPageY - parseInt(getComputedStyle(node, null).marginTop, 10);
        this.ghostWidth = node.offsetWidth + parseInt(getComputedStyle(node, null).marginLeft, 10) + parseInt(getComputedStyle(node, null).marginRight, 10);

        this.dragData = data;
        this.renderGhostCallback = renderGhost;

        // prepare scroll
        this.lastScrollTime = new Date().getTime();
        window.requestAnimationFrame(() => this.scrollWindow());

        this.update({
            isDragging: true,
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
    }

    public endDrag() {
        new Promise<void>((res) => {
            this.update({ isDragging: false });
            res();
        }).then(() => {
            this.renderGhostCallback = null;
            this.dragData = null;
            this.isDragging = false;
        });

    }

    xScrollNode: HTMLElement = null;
    yScrollNode: HTMLElement = null;

    private windowMouseMoveHandler = (e: Event) => {
        if (this.isDragging) {
            this.xScrollNode = getScrollParent(e.target as HTMLElement, 'x');
            this.yScrollNode = getScrollParent(e.target as HTMLElement, 'y');
        }
    }

    private windowMouseUpHandler = (e: Event) => {
        this.isDragging && this.endDrag();
    }

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

        if (scrollDir != 0) {
            const step = (now - this.lastScrollTime) / 1000 * maxScrollSpeed * scrollDir;
            return nodeScroll + step;
        }
    }

    private scrollWindow() {
        const now = new Date().getTime();

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

function getScrollParent(node: HTMLElement, dimension: 'x' | 'y'): HTMLElement {
    if (node == null) {
        return null;
    }

    const isElement = node instanceof HTMLElement;
    const style = isElement && window.getComputedStyle(node);

    let overflow: string;
    let scrollSize: number;
    let clientSize: number;

    if (dimension === 'x') {
        overflow = style && style.overflowX;
        scrollSize = node.scrollWidth;
        clientSize =  node.clientWidth;
    } else {
        overflow = style && style.overflowY;
        scrollSize = node.scrollHeight;
        clientSize =  node.clientHeight;
    }

    const isScrollable = overflow !== 'visible' && overflow !== 'hidden';

    if (isScrollable && scrollSize > clientSize) {
        return node;
    } else {
        return getScrollParent(node.parentNode as HTMLElement, dimension);
    }
}
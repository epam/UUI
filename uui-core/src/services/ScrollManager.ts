import { uuiMarkers } from '../constants';
import { isClientSide } from '../helpers';

export interface ScrollPosition {
    x: number;
    y: number;
}

/**
 * @deprecated will be removed in the next major release
 */
export class ScrollManager {
    public scrollPosition: ScrollPosition = {
        y: 0,
        x: 0,
    };

    private scrollWidth?: number;

    private clientWidth?: number;

    private offsetLeft?: number;

    private markersStatus = {
        displayLeft: false,
        displayRight: false,
        isUpdated: false,
    };

    subscribers: { node: HTMLElement }[] = [];

    scrollNodes: { node: HTMLElement; scrollHandler: any }[] = [];

    updateScrollPosition(scrollPosition: ScrollPosition) {
        if (scrollPosition.x === this.scrollPosition.x && scrollPosition.y === this.scrollPosition.y) {
            return;
        }

        const xScrollChanged = scrollPosition.x !== this.scrollPosition.x;

        this.scrollPosition = scrollPosition;
        if (xScrollChanged) {
            this.markersStatus.isUpdated = false;
            this.subscribers.forEach((s) => this.updateAttachedNodeNodeScroll(s.node));
            this.scrollNodes.forEach((s) => this.updateScrollingNodeScroll(s.node));
        }
    }

    updateMarkersStatus(node: HTMLElement) {
        const { clientWidth, scrollWidth, offsetLeft } = node;

        if (clientWidth !== this.clientWidth || offsetLeft !== this.offsetLeft) {
            this.markersStatus.isUpdated = false;
        }

        if (!this.markersStatus.isUpdated) {
            this.clientWidth = clientWidth;
            this.scrollWidth = scrollWidth;
            this.offsetLeft = offsetLeft;
            this.markersStatus = {
                displayLeft: offsetLeft !== 0,
                displayRight: -offsetLeft + clientWidth < scrollWidth,
                isUpdated: true,
            };
        }
    }

    setAttachedNodeScroll(node: HTMLElement) {
        if (this.scrollPosition.x > 0) {
            node.style.left = `-${this.scrollPosition.x}px`;
        }

        this.updateMarkers(node);
    }

    updateAttachedNodeNodeScroll(node: HTMLElement) {
        node.style.left = `-${this.scrollPosition.x}px`;
        this.updateMarkers(node);
    }

    updateScrollingNodeScroll(node: HTMLElement) {
        node.scrollLeft = this.scrollPosition.x;
        this.updateMarkers(node);
    }

    setScrollingNodeScroll(node: HTMLElement) {
        node.scrollLeft = this.scrollPosition.x;
        this.updateMarkers(node);
    }

    updateMarkers(node: HTMLElement) {
        this.updateMarkersStatus(node);

        if (this.markersStatus.displayLeft) {
            node.classList.add(uuiMarkers.scrolledLeft);
        } else {
            node.classList.remove(uuiMarkers.scrolledLeft);
        }

        if (this.markersStatus.displayRight) {
            node.classList.add(uuiMarkers.scrolledRight);
        } else {
            node.classList.remove(uuiMarkers.scrolledRight);
        }
    }

    updateXScroll(x: number) {
        this.updateScrollPosition({ ...this.scrollPosition, x });
    }

    handleOnWheel(e: WheelEvent, node: HTMLElement) {
        if (e.deltaY !== 0) {
            return;
        }

        if (this.scrollPosition.x + e.deltaX + node.clientWidth <= node.scrollWidth && this.scrollPosition.x + e.deltaX >= 0) {
            this.updateXScroll(this.scrollPosition.x + e.deltaX);
            e.preventDefault();
        }
    }

    resizeObserver = isClientSide
        && new ResizeObserver((entries) => {
            for (const entry of entries) {
                const contentRect = entry.contentRect;

                if (contentRect.width !== this.scrollWidth || contentRect.width < this.scrollWidth) {
                    entries.forEach((element) => this.updateMarkers(element.target as HTMLElement));
                }
            }
        });

    attachNode(node: HTMLElement) {
        this.subscribers.push({ node });
        this.resizeObserver.observe(node);
        this.setAttachedNodeScroll(node);
        node.addEventListener('wheel', (e: any) => this.handleOnWheel(e, node));
    }

    detachNode(node: HTMLElement) {
        const subscriber = this.subscribers.find((s) => s.node === node);
        if (subscriber) {
            this.resizeObserver.unobserve(subscriber.node);
            this.subscribers = this.subscribers.filter((s) => s !== subscriber);
        }
    }

    attachScrollNode = (node: HTMLElement) => {
        const scrollHandler = (e: any) => this.updateXScroll(e.target.scrollLeft);
        node.addEventListener('scroll', scrollHandler);

        this.resizeObserver.observe(node);
        this.setScrollingNodeScroll(node);

        this.scrollNodes.push({
            node,
            scrollHandler,
        });
    };

    detachScrollNode(node: HTMLElement) {
        const subscriber = this.scrollNodes.find((s) => s.node === node);
        if (subscriber) {
            subscriber.node.removeEventListener('scroll', subscriber.scrollHandler);
            this.scrollNodes = this.scrollNodes.filter((s) => s !== subscriber);
        }
    }
}

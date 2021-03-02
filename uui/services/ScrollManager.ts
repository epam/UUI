import { uuiMarkers } from '../constants';
export interface ScrollPosition {
    x: number;
    y: number;
}

export class ScrollManager {
    public scrollPosition: ScrollPosition = {
        y: 0,
        x: 0,
    };

    private markersStatus = {
        displayLeft: false,
        displayRight: false,
        isValid: false,
    };

    subscribers: { node: HTMLElement }[] = [];
    scrollNodes: { node: HTMLElement, scrollHandler: any }[] = [];

    updateScrollPosition(scrollPosition: ScrollPosition) {
        if (scrollPosition.x === this.scrollPosition.x && scrollPosition.y === this.scrollPosition.y) {
            return;
        }

        let xScrollChanged = scrollPosition.x !== this.scrollPosition.x;

        this.scrollPosition = scrollPosition;
        if (xScrollChanged) {
            this.markersStatus.isValid = false;
            this.subscribers.forEach(s => this.updateNodeScroll(s.node));
            this.scrollNodes.forEach(s => this.updateScrollingNodeScroll(s.node));
        }
    }

    updateMarkersStatus(node: HTMLElement) {
        if (!this.markersStatus.isValid) {
            const { clientWidth, scrollWidth, offsetLeft } = node;
            this.markersStatus = {
                displayLeft: offsetLeft != 0,
                displayRight: -offsetLeft + clientWidth != scrollWidth,
                isValid: true,
            };
        }
    }

    setAttachedNodeScroll(node: HTMLElement) {
        if (this.scrollPosition.x > 0) {
            node.style.left = `-${this.scrollPosition.x}px`;
        }

        this.updateMarkersStatus(node);
        this.setMarkers(node);
    }

    updateNodeScroll(node: HTMLElement) {
        node.style.left = `-${this.scrollPosition.x}px`;
        this.updateMarkers(node);
    }

    updateScrollingNodeScroll(node: HTMLElement) {
        node.scrollLeft = this.scrollPosition.x;
        this.updateMarkers(node);
    }

    setScrollingNodeScroll(node: HTMLElement) {
        node.scrollLeft = this.scrollPosition.x;
        this.setMarkers(node);
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

    setMarkers(node: HTMLElement) {
        this.updateMarkersStatus(node);

        if (this.markersStatus.displayLeft) {
            node.classList.add(uuiMarkers.scrolledLeft);
        }

        if (this.markersStatus.displayRight) {
            node.classList.add(uuiMarkers.scrolledRight);
        }
    }

    updateYScroll(y: number) {
        this.updateScrollPosition({...this.scrollPosition, y });
    }

    updateXScroll(x: number) {
        this.updateScrollPosition({...this.scrollPosition, x });
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

    attachNode(node: HTMLElement) {
        this.subscribers.push({
            node,
        });
        this.setAttachedNodeScroll(node);
        node.addEventListener('wheel', (e: any) => { this.handleOnWheel(e, node); });
    }

    detachNode(node: HTMLElement) {
        const subscriber = this.subscribers.find(s => s.node === node);
        if (subscriber) {
            this.subscribers = this.subscribers.filter(s => s !== subscriber);
        }
    }

    attachScrollNode = (node: HTMLElement) => {
        const scrollHandler = (e: any) => this.updateXScroll(e.target.scrollLeft);
        node.addEventListener('scroll', scrollHandler);

        this.setScrollingNodeScroll(node);

        this.scrollNodes.push({
            node,
            scrollHandler,
        });
    }

    detachScrollNode(node: HTMLElement) {
        const subscriber = this.scrollNodes.find(s => s.node === node);
        if (subscriber) {
            subscriber.node.removeEventListener('scroll', subscriber.scrollHandler);
            this.scrollNodes = this.scrollNodes.filter(s => s !== subscriber);
        }
    }
}

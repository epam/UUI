import React from 'react';
import * as css from './VirtualList.scss';
import { IHasCX, IEditable, VirtualListState } from '@epam/uui';
import cx from 'classnames';
import { IScrollbarsPositionValues } from './ScrollBars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import OverlayScrollbars from "overlayscrollbars";
import ReactDOM from 'react-dom';

export interface VirtualListProps extends IHasCX, IEditable<VirtualListState> {
    rows: React.ReactNode[];
    rowsCount?: number;
    focusedIndex?: number;
    onScroll?(value: IScrollbarsPositionValues): void;
    style?: React.CSSProperties;
    scrollBarsOptions?: OverlayScrollbars.Options;
}

export class VirtualList extends React.Component<VirtualListProps, { [key: string]: any }> {
    container2: HTMLElement;
    container3: Element;
    topShadow: HTMLElement | null;
    bottomShadow: HTMLElement | null;
    blockAlign = 20;
    rowHeights: number[] = [];
    rowOffsets: number[] = [];
    estimatedHeight: number = null;
    scrollBars: OverlayScrollbarsComponent;
    scrollValues: IScrollbarsPositionValues = { scrollTop: 0 } ;

    handleUpdateScroll = () => {
        const scrollInstance = this.scrollBars?.osInstance();
        if (!scrollInstance) return;
        const {
            scrollTop,
            scrollLeft,
            clientHeight,
            scrollHeight,
            scrollWidth,
            clientWidth,
        } = scrollInstance.getElements().viewport;
        const { x: top, y: left } = scrollInstance.getState().overflowAmount;

        this.scrollValues = {
            scrollTop,
            scrollLeft,
            clientHeight,
            scrollHeight,
            scrollWidth,
            clientWidth,
            top,
            left,
        };
        if (this.props.onScroll) {
            this.props.onScroll(this.scrollValues);
        }
        let topIndex = 0;
        while (topIndex < this.props.rowsCount
            && this.rowOffsets[Math.min(topIndex + this.blockAlign, this.props.rowsCount)] < scrollTop
        ) {
            topIndex += this.blockAlign;
        }

        let bottomIndex = topIndex;
        let scrollBottom = scrollTop + clientHeight;
        while (bottomIndex < this.props.rowsCount
            && this.rowOffsets[Math.min(bottomIndex, this.props.rowsCount)] < scrollBottom
        ) {
            bottomIndex++;
        }

        let minVisibleCount = (bottomIndex - topIndex);
        let recommendedVisibleCount = minVisibleCount + this.blockAlign * 2;

        const value = this.props.value;
        if (topIndex != value.topIndex || minVisibleCount > value.visibleCount) {
            this.props.onValueChange({ ...this.props.value, topIndex: topIndex, visibleCount: recommendedVisibleCount });
        }

        // Update shadows visibility
        let showBottomShadow = scrollTop == 0
            ? this.estimatedHeight > clientHeight
            : (scrollHeight - clientHeight > scrollTop);

        this.topShadow?.style.setProperty('opacity', scrollTop > 0 ? '1' : '0');
        this.bottomShadow?.style.setProperty('opacity', showBottomShadow ? '1' : '0');
    }

    updateScrollToFocus() {
        const scrollInstance = this.scrollBars?.osInstance();
        if (!scrollInstance) return;
        const { scrollTop, clientHeight } = scrollInstance.getElements().viewport;
        let focusCoord = this.props.focusedIndex && this.rowOffsets[this.props.focusedIndex] || 0;
        let rowHeight = this.props.focusedIndex && this.rowHeights[this.props.focusedIndex] || 0;
        let topElementCoord = scrollTop - rowHeight;
        let bottomElementCoord = scrollTop + clientHeight;

        if (focusCoord < topElementCoord || bottomElementCoord < focusCoord) {
            const updatedTop = focusCoord - clientHeight / 2 + rowHeight / 2;
            scrollInstance.scroll({ top: updatedTop });
            this.scrollValues = { ...this.scrollValues, scrollTop: updatedTop };
        }
    }

    componentDidMount() {
        if (process.env.JEST_WORKER_ID) {
            return;
        }

        this.updateRowHeights();
        this.handleUpdateScroll();
        this.updateScrollToFocus();
    }

    componentDidUpdate(prevProps: VirtualListProps) {
        this.updateRowHeights();
        this.handleUpdateScroll();
        if (this.props.focusedIndex !== prevProps.focusedIndex) {
            this.updateScrollToFocus();
        }
    }

    updateRefs(scrollBars: OverlayScrollbarsComponent) {
        this.scrollBars = scrollBars;
        const root = scrollbars && ReactDOM.findDOMNode(scrollBars) as Element;
        this.container2 = root && root?.getElementsByClassName(css.container2)[0] as HTMLElement;
        this.container3 = root && root?.getElementsByClassName(css.container3)[0];
    }

    renderRows() {
        const topIndex = this.props.value?.topIndex || 0;
        const topY = this.rowOffsets[topIndex] || 0;

        return <div className={ css.container3 } style={ { marginTop: topY } }>
            { this.props.rows }
        </div>;
    }

    updateRowHeights() {
        const nodes = this.container3.children;
        const topIndex = this.props.value?.topIndex || 0;
        for (let n = 0; n < nodes.length; n++) {
            this.rowHeights[topIndex + n] = nodes[n].getBoundingClientRect().height;
        }
        const measured = this.rowHeights.filter(h => !!h);
        const averageHeight = measured.length > 0
            ? measured.reduce((sum, next) => sum + next, 0) / measured.length
            : 1;

        let lastOffset = 0;
        this.rowOffsets = [];
        for (let n = 0; n < this.props.rowsCount; n++) {
            this.rowOffsets[n] = lastOffset;
            let rowHeight = this.rowHeights[n];
            if (rowHeight == null) {
                rowHeight = averageHeight;
            }
            lastOffset += rowHeight;
        }

        let estimatedHeight = lastOffset;

        if (this.estimatedHeight != estimatedHeight) {
            this.container2.style.setProperty('min-height', `${estimatedHeight}px`);
        }

        this.estimatedHeight = estimatedHeight;
    }

    render() {
        return (
            <div className={ cx(css.wrapper, this.props.cx) }>
                <OverlayScrollbarsComponent
                    ref={ (el: OverlayScrollbarsComponent) => this.updateRefs(el) }
                    options={ {
                        paddingAbsolute: true,
                        scrollbars: {
                            autoHide: 'never',
                        },
                        callbacks: {
                            onScroll: this.handleUpdateScroll,
                        },
                        ...this.props.scrollBarsOptions,
                    } }
                    style={ {
                        width: "100%",
                        ...this.props.style,
                    } }
                    className={ css.body }
                >
                    <div className={ css.container2 } style={ { minHeight: this.estimatedHeight } }>
                        { this.renderRows() }
                    </div>
                </OverlayScrollbarsComponent>
                <div key='st' className='uui-scroll-shadow-top' ref={ el => this.topShadow = el } />
                <div key='sb' className='uui-scroll-shadow-bottom' ref={ el => this.bottomShadow = el } />
            </div>
        );
    }
}
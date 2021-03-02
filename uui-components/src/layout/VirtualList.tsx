import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as css from './VirtualList.scss';
import { IHasCX, IEditable, VirtualListState } from '@epam/uui';
import cx from 'classnames';
import ScrollBars, * as CustomScrollBars from 'react-custom-scrollbars';

export interface VirtualListProps extends IHasCX, IEditable<VirtualListState> {
    rows: React.ReactNode[];
    rowsCount?: number;
    focusedIndex?: number;
    onScroll?(value: CustomScrollBars.positionValues): void;
}

export class VirtualList extends React.Component<VirtualListProps, {}> {
    scrollBars: ScrollBars | null;
    container1: Element;
    container2: HTMLElement;
    container3: Element;
    topShadow: HTMLElement | null;
    bottomShadow: HTMLElement | null;
    blockAlign = 20;
    rowHeights: number[] = [];
    rowOffsets: number[] = [];
    estimatedHeight: number = null;
    scrollValues: CustomScrollBars.positionValues = { scrollTop: 0 } as any;

    handleUpdateScroll = () => {
        this.scrollValues = this.scrollBars.getValues();
        if (this.props.onScroll) {
            this.props.onScroll(this.scrollValues);
        }
        let topIndex = 0;
        let scrollTop = this.scrollValues.scrollTop;
        while (topIndex < this.props.rowsCount
            && this.rowOffsets[Math.min(topIndex + this.blockAlign, this.props.rowsCount)] < scrollTop
        ) {
            topIndex += this.blockAlign;
        }

        let bottomIndex = topIndex;
        let scrollBottom = scrollTop + this.scrollValues.clientHeight;
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
        let showBottomShadow = this.scrollValues.scrollTop == 0
            ? this.estimatedHeight > this.scrollValues.clientHeight
            : (this.scrollValues.scrollHeight - this.scrollValues.clientHeight > this.scrollValues.scrollTop);

        this.topShadow?.style.setProperty('opacity', this.scrollValues.scrollTop > 0 ? '1' : '0');
        this.bottomShadow?.style.setProperty('opacity', showBottomShadow ? '1' : '0');
    }

    updateScrollToFocus() {
        let focusCoord = this.props.focusedIndex && this.rowOffsets[this.props.focusedIndex] || 0;
        let rowHeight = this.props.focusedIndex && this.rowHeights[this.props.focusedIndex] || 0;
        let topElementCoord = this.scrollValues.scrollTop - rowHeight;
        let bottomElementCoord = this.scrollValues.scrollTop + this.scrollValues.clientHeight;

        if (focusCoord < topElementCoord || bottomElementCoord < focusCoord) {
            this.scrollBars.scrollTop(focusCoord - this.scrollValues.clientHeight / 2 + rowHeight / 2);
            this.scrollValues = this.scrollBars.getValues();
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

    updateRefs(scrollBars: ScrollBars) {
        this.scrollBars = scrollBars;
        const root = scrollbars && ReactDOM.findDOMNode(scrollBars) as Element;
        this.container1 = root && root?.getElementsByClassName(css.container1)[0];
        this.container2 = root && root?.getElementsByClassName(css.container2)[0] as HTMLElement;
        this.container3 = root && root?.getElementsByClassName(css.container3)[0];
    }

    renderRows() {
        const topIndex = this.props.value?.topIndex || 0;
        const topY = this.rowOffsets[topIndex] || 0;

        return <div className={ css.container3 } style={ { top: topY } }>
            { this.props.rows }
        </div>;
    }

    updateRowHeights() {
        const nodes = this.container3?.children;
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
            this.container2.style.setProperty('height', `${estimatedHeight}px`);
        }

        this.estimatedHeight = estimatedHeight;
    }

    renderView({ style, ...props }: { style: {}, props: any }) {

        return (
            <div
                className={ css.container1 }
                style={ { ...style } }
                { ...props }
            />
        );
    }

    render() {
        return (
            <div className={ cx(css.wrapper, this.props.cx) }>
                <ScrollBars
                    key='s'
                    autoHeight
                    className={ css.body }
                    onScroll={ this.handleUpdateScroll }
                    hideTracksWhenNotNeeded
                    renderView={ this.renderView.bind(this) }
                    ref={ el => this.updateRefs(el) }
                    autoHeightMax={ 100500 }
                    renderThumbHorizontal={ () => <div className='uui-thumb'/> }
                    renderThumbVertical={ () => <div className='uui-thumb'/> }
                >
                    <div className={ css.container2 } style={ { height: this.estimatedHeight } }>
                        { this.renderRows() }
                    </div>
                </ScrollBars>
                <div key='st' className='uui-scroll-shadow-top' ref={ el => this.topShadow = el } />
                <div key='sb' className='uui-scroll-shadow-bottom' ref={ el => this.bottomShadow = el } />
            </div>
        );
    }
}
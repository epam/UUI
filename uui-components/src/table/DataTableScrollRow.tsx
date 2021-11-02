import React, { CSSProperties, ReactNode, Component } from 'react';
import { ScrollBars, ScrollbarsApi } from '../layout';
import { ScrollManager, DataColumnProps, IHasCX, cx, IHasRawProps } from '@epam/uui';
import { FlexCell } from '../layout/flexItems/FlexCell';
import { DataTableRowContainer } from './DataTableRowContainer';
import * as css from './DataTableScrollRow.scss';

export interface DataTableScrollRowProps<TItem = {}, TId = {}> extends IHasCX, IHasRawProps<HTMLDivElement> {
    columns?: DataColumnProps<TItem, TId>[];
    scrollManager?: ScrollManager;
    cellClass?: string;
}

const uuiDataTableScrollRow = {
    uuiTableScrollRowContainer: 'uui-table-scroll-row-container',
    uuiTableScrollRow: 'uui-table-scroll-row',
    uuiTableScrollBar: 'uui-table-scroll-bar',
};

export class DataTableScrollRow<TItem, TId> extends Component<DataTableScrollRowProps<TItem, TId>, {}> {
    renderCell = (column: DataColumnProps<TItem, TId>) => (
        <FlexCell cx={ [css.cellPlaceholder, this.props.cellClass] } { ...column } key={ column.key } />
    );

    private clientWidth?: number;

    resizeObserver = new ResizeObserver(entries => {
        for (const { contentRect } of entries) {
            if (contentRect.width !== this.clientWidth) {
                this.forceUpdate();
            }
        }
    });

    componentWillUnmount() {
        this.resizeObserver.disconnect();
    }

    wrapScrollingSection = (content: ReactNode, style: CSSProperties) => (
        <ScrollBars
            className={ uuiDataTableScrollRow.uuiTableScrollBar }
            hideTracksWhenNotNeeded
            style={ style }
            vertical={ false }
            horizontal={ true }
            ref={ (scrollBars: ScrollbarsApi) => {
                const node = scrollBars?.container?.children[0] as HTMLElement;
                if (!node) return;
                this.props.scrollManager?.attachScrollNode(node);
                this.resizeObserver?.observe(node);
                this.clientWidth = node.clientWidth;
            } }
        >
            { content }
        </ScrollBars>
    );

    render() {
        return (
            <div
                className={ cx([
                    uuiDataTableScrollRow.uuiTableScrollRowContainer,
                    this.props.cx,
                ]) }
                { ...this.props.rawProps }
            >
                <DataTableRowContainer<TItem, TId>
                    cx={ uuiDataTableScrollRow.uuiTableScrollRow }
                    scrollManager={ this.props.scrollManager }
                    columns={ this.props.columns }
                    renderCell={ this.renderCell }
                    wrapScrollingSection={ this.wrapScrollingSection }
                />
            </div>
        );
    }
}
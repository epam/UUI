import * as React from 'react';
import cx from 'classnames';
import { ScrollManager, DataColumnProps, IHasCX } from '@epam/uui';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import { FlexCell } from '../layout/flexItems/FlexCell';
import { DataTableRowContainer } from './DataTableRowContainer';
import * as css from './DataTableScrollRow.scss';

export interface DataTableScrollRowProps extends IHasCX {
    columns?: DataColumnProps<any, any>[];
    scrollManager?: ScrollManager;
    cellClass?: string;
}

const uuiDataTableScrollRow = {
    uuiTableScrollRowContainer: 'uui-table-scroll-row-container',
    uuiTableScrollRow: 'uui-table-scroll-row',
    uuiTableScrollBar: 'uui-table-scroll-bar',
};

export class DataTableScrollRow extends React.Component<DataTableScrollRowProps, {}> {
    renderCell(column: DataColumnProps<any, any>) {
        return <FlexCell  cx={ [css.cellPlaceholder, this.props.cellClass] } { ...column } key={ column.key } />;
    }

    private clientWidth?: number;

    resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const contentRect = entry.contentRect;

            if (contentRect.width !== this.clientWidth) {
                this.forceUpdate();
            }
        }
    });

    componentWillUnmount() {
        this.resizeObserver.disconnect();
    }

    wrapScrollingSection(content: React.ReactNode, style: React.CSSProperties) {
        return (
            <OverlayScrollbarsComponent
                className={ uuiDataTableScrollRow.uuiTableScrollBar }
                style={ style }
                ref={ (scrollBars: OverlayScrollbarsComponent) => {
                    let node = scrollBars?.osInstance()?.getElements().viewport;
                    if (!node) return;
                    this.props.scrollManager && this.props.scrollManager.attachScrollNode(node);
                    this.resizeObserver && this.resizeObserver.observe(node);
                    this.clientWidth = node.clientWidth;
                } }
            >
                { content }
            </OverlayScrollbarsComponent>
        );
    }

    render() {
        return (
            <div className={ cx([uuiDataTableScrollRow.uuiTableScrollRowContainer, this.props.cx]) }>
                <DataTableRowContainer
                    cx={ uuiDataTableScrollRow.uuiTableScrollRow }
                    scrollManager={ this.props.scrollManager }
                    columns={ this.props.columns }
                    renderCell={ this.renderCell.bind(this) }
                    wrapScrollingSection={ this.wrapScrollingSection.bind(this) }
                />
            </div>
        );
    }
}
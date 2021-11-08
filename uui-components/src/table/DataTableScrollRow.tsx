import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ScrollBars from 'react-custom-scrollbars-2';
import { ScrollManager, DataColumnProps, IHasCX, cx, IHasRawProps } from '@epam/uui';
import { FlexCell } from '../layout/flexItems/FlexCell';
import { DataTableRowContainer } from './DataTableRowContainer';
import * as css from './DataTableScrollRow.scss';

export interface DataTableScrollRowProps extends IHasCX, IHasRawProps<HTMLDivElement> {
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
            <ScrollBars
                className={ uuiDataTableScrollRow.uuiTableScrollBar }
                hideTracksWhenNotNeeded
                style={ style }
                ref={ (scrollBars: ScrollBars) => {
                    let node = ReactDOM.findDOMNode(scrollBars) as HTMLElement;
                    node = node && node.children[0] as HTMLElement;
                    node && this.props.scrollManager && this.props.scrollManager.attachScrollNode(node);
                    node && this.resizeObserver && this.resizeObserver.observe(node);
                    this.clientWidth = node && node.clientWidth;
                } }
                renderThumbHorizontal={ () => <div className='uui-thumb-horizontal' /> }

            >
                { content }
            </ScrollBars>
        );
    }

    render() {
        return (
            <div
                className={ cx([
                    uuiDataTableScrollRow.uuiTableScrollRowContainer,
                    this.props.cx,
                ]) }
                { ...this.props.rawProps }
            >
                <DataTableRowContainer
                    cx={ uuiDataTableScrollRow.uuiTableScrollRow }
                    columns={ this.props.columns }
                    renderCell={ this.renderCell.bind(this) }
                    wrapScrollingSection={ this.wrapScrollingSection.bind(this) }
                />
            </div>
        );
    }
}
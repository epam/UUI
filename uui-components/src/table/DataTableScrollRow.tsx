import * as React from 'react';
import cx from 'classnames';
import {ScrollManager, DataColumnProps, IHasCX} from '@epam/uui';
import { FlexCell } from '../layout/flexItems/FlexCell';
import { DataTableRowContainer } from './DataTableRowContainer';
import * as css from './DataTableScrollRow.scss';
import * as ReactDOM from 'react-dom';
import ScrollBars from 'react-custom-scrollbars';

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

    wrapScrollingSection(content: React.ReactNode, style: React.CSSProperties) {
        return (
            <ScrollBars
                autoHeight
                className={ uuiDataTableScrollRow.uuiTableScrollBar }
                hideTracksWhenNotNeeded
                style={ style }
                ref={ (scrollBars: ScrollBars) => {
                    let node = ReactDOM.findDOMNode(scrollBars) as HTMLElement;
                    node = node && node.children[0] as HTMLElement;
                    node && this.props.scrollManager && this.props.scrollManager.attachScrollNode(node);
                } }
            >
                { content }
            </ScrollBars>
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
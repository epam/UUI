import * as React from 'react';
import { DataTableHeaderCellProps, uuiMarkers, uuiDataTableHeaderCell, cx } from '@epam/uui-core';
import { FlexCell } from '@epam/uui-components';
import css from './DataTableTimelineHeaderCell.module.scss';
import { DataTableHeaderCellMods } from './types';

interface DataTableHeaderCellState {
    isDropdownOpen: boolean;
}

export class DataTableTimelineHeaderCell<TItem, TId> extends React.Component<
DataTableHeaderCellProps<TItem, TId> 
& DataTableHeaderCellMods 
& { children: React.ReactNode },
DataTableHeaderCellState
> {
    state: DataTableHeaderCellState = {
        isDropdownOpen: null,
    };

    getColumnCaption = () => {
        return (
            <div className={ cx(css.captionWrapper, css['align-' + this.props.column.textAlign], uuiDataTableHeaderCell.uuiTableHeaderCaptionWrapper) }>
                { this.props.children }
            </div>
        );
    };

    renderCellContent = () => {
        const isResizable = this.props.column.allowResizing ?? this.props.allowColumnsResizing;
        // const sideColumnPadding = this.props.columnsGap === '12' ? '12' : '24';
        return (
            <FlexCell
                { ...this.props.column }
                minWidth={ this.props.column.width }
                cx={ cx(
                    'uui-dt-vars',
                    uuiDataTableHeaderCell.uuiTableHeaderCell,
                    (this.props.column.isSortable || this.props.isDropdown) && uuiMarkers.clickable,
                    css.cell,
                    css['size-' + (this.props.size || '36')],
                    // this.props.columnsGap && css[`column-gap-${this.props.columnsGap}`],
                    // this.props.isFirstColumn && css[`first-column-${sideColumnPadding}`],
                    // this.props.isLastColumn && css[`last-column-${sideColumnPadding}`],
                    this.props.column.cx,
                    this.props.column.fix && css['pinned-' + this.props.column.fix],
                    isResizable && css.resizable,
                ) }
                rawProps={ {
                    role: 'columnheader',
                    'aria-sort': 'none',
                } }
            >
                { this.getColumnCaption() }
            </FlexCell>
        );
    };

    render() {
        return this.renderCellContent();
    }
}

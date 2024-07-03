import * as React from 'react';
import { DataTableHeaderCellProps, uuiMarkers, uuiDataTableHeaderCell, cx } from '@epam/uui-core';
import { DataTableTimelineHeaderCell as UuiDataTableTimelineHeaderCell } from '@epam/uui-components';
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
    renderCellContent = () => {
        return (
            <div className={ cx(css.captionWrapper, css['align-' + this.props.column.textAlign], uuiDataTableHeaderCell.uuiTableHeaderCaptionWrapper) }>
                { this.props.children }
            </div>
        );
    };

    render() {
        const isResizable = this.props.column.allowResizing ?? this.props.allowColumnsResizing;
        return (
            <UuiDataTableTimelineHeaderCell 
                { ...this.props }
                renderCellContent={ this.renderCellContent }
                cx= {
                    cx(
                        'uui-dt-vars',
                        uuiDataTableHeaderCell.uuiTableHeaderCell,
                        (this.props.column.isSortable || this.props.isDropdown) && uuiMarkers.clickable,
                        css.cell,
                        css['size-' + (this.props.size || '36')],
                        this.props.column.cx,
                        this.props.column.fix && css['pinned-' + this.props.column.fix],
                        isResizable && css.resizable,
                    )
                }
            />
        );
    }
}

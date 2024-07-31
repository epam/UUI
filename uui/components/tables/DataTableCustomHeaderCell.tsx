import * as React from 'react';
import { DataTableHeaderCellProps, uuiDataTableHeaderCell, cx } from '@epam/uui-core';
import { DataTableCustomHeaderCell as UuiDataTableCustomHeaderCell } from '@epam/uui-components';
import css from './DataTableCustomHeaderCell.module.scss';
import { DataTableHeaderCellMods } from './types';

interface DataTableHeaderCellState {
    isDropdownOpen: boolean;
}

export class DataTableCustomHeaderCell<TItem, TId> extends React.Component<
DataTableHeaderCellProps<TItem, TId> 
& DataTableHeaderCellMods 
& { children: React.ReactNode },
DataTableHeaderCellState
> {
    renderCellContent = () => {
        return this.props.children;
    };

    render() {
        return (
            <UuiDataTableCustomHeaderCell 
                { ...this.props }
                renderCellContent={ this.renderCellContent }
                cx= {
                    cx(
                        'uui-dt-vars',
                        uuiDataTableHeaderCell.uuiTableHeaderCell,
                        css.cell,
                        this.props.column.cx,
                    )
                }
            />
        );
    }
}

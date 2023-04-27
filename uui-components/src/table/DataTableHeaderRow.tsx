import React from 'react';
import {
    DataSourceState, DataColumnProps, DataTableHeaderRowProps, DropdownBodyProps, Lens, getColumnsConfig, DropParams, getOrderBetween,
} from '@epam/uui-core';
import { DataTableRowContainer } from './DataTableRowContainer';
import css from './DataTableHeaderRow.scss';

const uuiDataTableHeaderRow = {
    uuiTableHeaderRow: 'uui-table-header-row',
};

export class DataTableHeaderRow<TItem, TId> extends React.Component<DataTableHeaderRowProps<TItem, TId>> {
    lens = Lens.onEditableComponent<DataSourceState>(this);
    sortLens = this.lens.prop('sorting');
    filterLens = this.lens.prop('filter');
    onCellDrop = (params: DropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>, index: number) => {
        const columnsConfig = getColumnsConfig(this.props.columns, this.props.value.columnsConfig);

        const dstColumnConfig = columnsConfig[params.dstData.key];
        const srcColumnConfig = columnsConfig[params.srcData.key];

        const prevColumnOrder = this.props.columns[index - 1] ? columnsConfig[this.props.columns[index - 1].key].order : null;
        const nextColumnOrder = this.props.columns[index + 1] ? columnsConfig[this.props.columns[index + 1].key].order : null;

        if (params.position === 'left') {
            const newOrder = getOrderBetween(prevColumnOrder, dstColumnConfig.order);
            columnsConfig[params.srcData.key] = { ...srcColumnConfig, order: newOrder };
        } else if (params.position === 'right') {
            const newOrder = getOrderBetween(dstColumnConfig.order, nextColumnOrder);
            columnsConfig[params.srcData.key] = { ...srcColumnConfig, order: newOrder };
        }

        this.props.onValueChange({ ...this.props.value, columnsConfig });
    };

    renderCell = (column: DataColumnProps<TItem, TId>, idx: number) => {
        const { field, direction } = this.sortLens.index(0).default({ field: null, direction: 'asc' }).get();

        return this.props.renderCell({
            key: column.key,
            column,
            value: this.props.value,
            onValueChange: this.props.onValueChange,
            selectAll: this.props.selectAll,
            isFirstColumn: idx === 0,
            isLastColumn: idx === this.props.columns.length - 1,
            isFilterActive: column.isFilterActive?.(this.filterLens.default({}).get(), column),
            sortDirection: field === column.key ? direction : null,
            allowColumnsReordering: this.props.allowColumnsReordering,
            allowColumnsResizing: this.props.allowColumnsResizing,
            onSort: (dir) =>
                this.props.onValueChange({
                    ...this.props.value,
                    sorting: dir ? [{ field: column.key, direction: dir }] : undefined,
                }),
            onDrop: (params) => this.onCellDrop(params, idx),
            renderFilter: (dropdownProps: DropdownBodyProps) => column.renderFilter(this.filterLens, dropdownProps),
            isDropdown: !!column.renderFilter,
        });
    };

    render() {
        return (
            <DataTableRowContainer
                cx={ [
                    css.root, this.props.cx, uuiDataTableHeaderRow.uuiTableHeaderRow,
                ] }
                columns={ this.props.columns }
                renderCell={ this.renderCell }
                rawProps={ { role: 'row' } }
                renderConfigButton={ this.props.onConfigButtonClick && this.props.renderConfigButton }
            />
        );
    }
}

import * as React from 'react';
import {uuiContextTypes, DataSourceState, SortDirection, DataColumnProps, DataTableHeaderRowProps, Lens, DataTableHeaderCellProps,
    getColumnsConfig, DropParams, getOrderBetween} from '@epam/uui';
import { DataTableRowContainer } from './DataTableRowContainer';

const uuiDataTableHeaderRow = {
    uuiTableHeaderRow: 'uui-table-header-row',
};

export class DataTableHeaderRow<T> extends React.Component<DataTableHeaderRowProps<T, any>, {}> {
    static contextTypes = uuiContextTypes;

    lens = Lens.onEditableComponent<DataSourceState>(this);
    sortLens = this.lens.prop('sorting');
    filterLens = this.lens.prop('filter');

    onCellDrop = (params: DropParams<DataColumnProps<any>, DataColumnProps<any>>, index: number) => {
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
    }

    renderCell = (column: DataColumnProps<any, any>, idx: number) => {
        const sorting = this.sortLens.index(0).default({ field: null, direction: 'asc' }).get();

        const cellProps: DataTableHeaderCellProps<T, any> = {
            column,
            value: this.props.value,
            onValueChange: this.props.onValueChange,
            selectAll: this.props.selectAll,
            isFirstColumn: idx === 0,
            isLastColumn: idx === this.props.columns.length - 1,
            isFilterActive: column.isFilterActive && column.isFilterActive(this.filterLens.default({}).get(), column),
            sortDirection: sorting.field === column.key ? (sorting.direction || 'asc') : null,
            allowColumnsReordering: this.props.allowColumnsReordering,
            allowColumnsResizing: this.props.allowColumnsResizing,
            onSort: (dir: SortDirection) => this.props.onValueChange({
                ...this.props.value,
                sorting: (sorting.field !== column.key || sorting.direction !== dir) ? [{ field: column.key, direction: dir }] : [],
            }),
            onDrop: (params) => this.onCellDrop(params, idx),
            renderFilter: () => column.renderFilter(this.filterLens),
        };

        return this.props.renderCell(cellProps);
    }

    render() {
        return (
            <DataTableRowContainer
                cx={ [this.props.cx, uuiDataTableHeaderRow.uuiTableHeaderRow] }
                scrollManager={ this.props.scrollManager }
                columns={ this.props.columns }
                renderCell={ this.renderCell }
                renderConfigButton={ this.props.onConfigButtonClick && this.props.renderConfigButton }
            />
        );
    }
}

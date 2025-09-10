import React from 'react';
import {
    DataSourceState, DataColumnProps, DataTableHeaderRowProps, DropdownBodyProps, Lens, DropParams, getOrderBetween, DataTableState,
    DataColumnGroupProps,
} from '@epam/uui-core';
import { DataTableRowContainer } from './DataTableRowContainer';
import css from './DataTableHeaderRow.module.scss';

const uuiDataTableHeaderRow = {
    uuiTableHeaderRow: 'uui-table-header-row',
};

export class DataTableHeaderRow<TItem, TId> extends React.Component<DataTableHeaderRowProps<TItem, TId>> {
    lens = Lens.onEditableComponent<DataSourceState>(this);
    sortLens = this.lens.prop('sorting');
    filterLens = this.lens.prop('filter');
    onCellDrop = (params: DropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>, index: number) => {
        const columnsConfig = this.props.value.columnsConfig;
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

    areAllFolded = (state: DataTableState<any, any>) => {
        const areAllCollapsed = state?.foldAll === undefined || state?.foldAll;
        const unfoldedNodes = Object.values(state?.folded ?? {}).filter((folded) => !folded);
        const areAllNodesFolded = !state?.folded || !unfoldedNodes.length;

        return areAllCollapsed && areAllNodesFolded;
    };

    onFoldAll = () => {
        this.props.onValueChange({
            ...this.props.value,
            folded: {},
            foldAll: !this.areAllFolded(this.props.value),
        });
    };

    renderCell = (column: DataColumnProps<TItem, TId>, idx: number) => {
        const { field, direction } = this.sortLens.index(0).default({ field: null, direction: 'asc' }).get();

        const isFirstColumn = idx === 0;
        const isFoldAllEnabled = isFirstColumn && this.props.showFoldAll;
        return this.props.renderCell({
            key: column.key,
            column,
            value: this.props.value,
            onValueChange: this.props.onValueChange,
            selectAll: this.props.selectAll,
            showFoldAll: this.props.showFoldAll,
            onFoldAll: isFoldAllEnabled ? this.onFoldAll : undefined,
            areAllFolded: isFoldAllEnabled ? this.areAllFolded?.(this.props.value) : undefined,
            isFirstColumn,
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

    renderGroupCell = (group: DataColumnGroupProps, idx: number, firstColumnIdx: number, lastColumnIdx: number) => {
        const isFirstCell = firstColumnIdx === 0;
        const isLastCell = lastColumnIdx === this.props.columns.length - 1;
        return this.props.renderGroupCell({
            key: `groupTitle-${group.key}-${idx}`,
            group,
            isFirstCell,
            isLastCell,
            value: this.props.value,
            onValueChange: this.props.onValueChange,
        });
    };

    render() {
        return (
            <DataTableRowContainer
                cx={ [
                    css.root, this.props.cx, uuiDataTableHeaderRow.uuiTableHeaderRow,
                ] }
                columnGroups={ this.props.columnGroups }
                columns={ this.props.columns }
                renderCell={ this.renderCell }
                renderGroupCell={ this.renderGroupCell }
                rawProps={ { role: 'row' } }
                renderConfigButton={ this.props.onConfigButtonClick && this.props.renderConfigButton }
            />
        );
    }
}

import React, { useMemo } from 'react';
import { DataTable } from '@epam/uui';
import { DataRowProps, DataSourceListProps, DataTableState, IControlled } from '@epam/uui-core';
import { DataTableFocusManager } from '@epam/uui-components';
import { ColumnsProps, Task } from './types';
import { getColumnsTableMode, columnGroups } from './columns';

export interface TableModeProps extends ColumnsProps {
    rows: DataRowProps<Task, any>[];
    tableState: IControlled<DataTableState<any, any>>['value'];
    setTableState: IControlled<DataTableState<any, any>>['onValueChange'];
    listProps: DataSourceListProps;
    dataTableFocusManager: DataTableFocusManager<number>;
}

export function TableMode({
    rows, tableState, setTableState, listProps, dataTableFocusManager, insertTask, deleteTask,
}: TableModeProps) {
    const columns = useMemo(
        () => getColumnsTableMode({ insertTask, deleteTask }),
        [insertTask, deleteTask],
    );

    return (
        <DataTable
            headerTextCase="upper"
            rows={ rows }
            columnGroups={ columnGroups }
            columns={ columns }
            value={ tableState }
            onValueChange={ setTableState }
            dataTableFocusManager={ dataTableFocusManager }
            showColumnsConfig
            allowColumnsResizing
            allowColumnsReordering
            { ...listProps }
        />
    );
}

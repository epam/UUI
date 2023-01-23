import { DataTable, useForm, Panel } from '@epam/promo';
import React, { useCallback, useMemo } from 'react';
import { AcceptDropParams, DataQueryFilter, DataTableState, DropParams, DropPosition, Metadata, SelectedCellData, useArrayDataSource } from '@epam/uui-core';
import { Task } from './types';
import { getDemoTasks } from './demoData';
import { getColumns } from './columns';

interface FormState {
    items: Record<number, Task>;
}

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    name: { isRequired: true },
                },
            },
        },
    },
};

let lastId = -1;

let savedValue: FormState = { items: getDemoTasks() };

export const TimeReportDemo = () => {
    const { lens, value, onValueChange, save, isChanged, revert, undo, canUndo, redo, canRedo } = useForm<FormState>({
        value: savedValue,
        onSave: async (value) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            onValueChange(value);
        },
        getMetadata: () => metadata,
    });

    // Insert new/exiting top/bottom or above/below relative to other task
    const insertTask = (position: DropPosition, relativeTask: Task | null = null, existingTask: Task | null = null) => {
        const task: Task = existingTask ? { ...existingTask } : { id: lastId--, name: '' };

        if (position === 'inside') {
            task.parentId = relativeTask.id;
            relativeTask = null; // just insert as the first child
        }

        if (relativeTask) {
            task.parentId = relativeTask.parentId;
        }

        onValueChange({ ...value, items: { ...value.items, [task.id]: task } });
    };

    const handleCanAcceptDrop = useCallback((params: AcceptDropParams<Task, Task>) => ({ bottom: true, top: true, inside: true }), []);

    const handleDrop = useCallback((params: DropParams<Task, Task>) => insertTask(params.position, params.dstData, params.srcData), []);

    //const { tableState, setTableState } = useTableState<any>({ columns });
    const [tableState, setTableState] = React.useState<DataTableState>({ sorting: [{ field: 'order' }] });

    const dataSource = useArrayDataSource<Task, number, DataQueryFilter<Task>>({
        items: Object.values(value.items),
        getId: i => i.id,
        getParentId: i => i.parentId,
    }, []);


    const dataView = dataSource.useView(tableState, setTableState, {
        getRowOptions: (task) => ({
            ...lens.prop('items').prop(task.id).toProps(), // pass IEditable to each row to allow editing
            //checkbox: { isVisible: true },
            isSelectable: true,
            dnd: {
                srcData: task,
                dstData: task,
                canAcceptDrop: handleCanAcceptDrop,
                onDrop: handleDrop,
            },
        }),
    });

    const columns = useMemo(() => getColumns({ insertTask: () => {}, deleteTask: () => {} }), []);

    const onCopy = (copyFrom: SelectedCellData<Task>, selectedCells: SelectedCellData<Task>[]) => {
        const valueToCopy = copyFrom.row.value?.[copyFrom.column.key as keyof Task];
        const newItems = { ...value.items };
        for (const cell of selectedCells) {
            const cellRowId = cell.row.value.id;
            newItems[cellRowId] = { ...newItems[cellRowId], [cell.column.key]: valueToCopy };
        }

        onValueChange({ ...value, items: newItems });
    };


    return <Panel style={ { width: '100%' } }>
        <DataTable
            headerTextCase='upper'
            onCopy={ onCopy }
            getRows={ dataView.getVisibleRows }
            columns={ columns }
            value={ tableState }
            onValueChange={ setTableState }
            showColumnsConfig
            allowColumnsResizing
            { ...dataView.getListProps() }
        />
    </Panel>;
};
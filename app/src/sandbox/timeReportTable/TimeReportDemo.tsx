import { DataTable, useForm, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton } from '@epam/promo';
import React, { useCallback, useMemo } from 'react';
import { AcceptDropParams, BaseCellData, DataQueryFilter, DataTableState, DropParams, DropPosition, Metadata, useArrayDataSource } from '@epam/uui-core';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/common/table-row_plus_after-24.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/common/table-row_plus_before-24.svg';
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
    }

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

    const onCopy = (copyFrom: BaseCellData<Task>, selectedCells: BaseCellData<Task>[]) => {
        const valueToCopy = copyFrom.rowLens.prop(copyFrom.key as keyof Task).get();
        const newItems = { ...value.items };
        for (const cell of selectedCells) {
            const cellRowId = cell.rowLens.prop('id').get();
            newItems[cellRowId] = { ...newItems[cellRowId], [cell.key]: valueToCopy };
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
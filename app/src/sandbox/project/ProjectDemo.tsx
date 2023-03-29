import { DataTable, useForm, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton } from '@epam/promo';
import React, { useCallback, useMemo, useState } from 'react';
import { AcceptDropParams, DataTableState, DropParams, DropPosition, Metadata, useList } from '@epam/uui-core';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/common/table-row_plus_after-24.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/common/table-row_plus_before-24.svg';
import { Task } from './types';
import { getDemoTasks } from './demoData';
import { getColumns } from './columns';
import { insertOrMoveTask } from './helpers';
import isEqual from 'lodash.isequal';

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

let savedValue: FormState = { items: getDemoTasks() };

export const ProjectDemo = () => {
    const [prevPatch, setPrevPatch] = useState<Record<number, Task>>();

    const { lens, value, setValue, save, isChanged, revert, undo, canUndo, redo, canRedo } = useForm<FormState>({
        value: savedValue,
        onSave: async (value) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            savedValue = value;
        },
        getMetadata: () => metadata,
    });

    // Insert new/exiting top/bottom or above/below relative to other task
    const insertTask = (position: DropPosition, relativeTask: Task | null = null, existingTask: Task | null = null) => {
        setValue(formState => ({
            ...formState,
            items: insertOrMoveTask(formState.items, position, relativeTask, existingTask)
        }));
    };

    const handleCanAcceptDrop = useCallback((params: AcceptDropParams<Task, Task>) => ({ bottom: true, top: true, inside: true }), []);

    const handleDrop = useCallback((params: DropParams<Task, Task>) => insertTask(params.position, params.dstData, params.srcData), []);

    const [tableState, setTableState] = React.useState<DataTableState>({ sorting: [{ field: 'order' }] });

    const onTableStateChange = (state: DataTableState) => {
        if (tableState.sorting !== state.sorting) {
            setPrevPatch(value.items)
        }

        setTableState(state);
    };

    const { rows, listProps } = useList({
        type: 'array',
        listState: tableState,
        setListState: onTableStateChange,
        items: Object.values(savedValue.items),

        getId: i => i.id,
        getParentId: i => i.parentId,
        getRowOptions: (task) => ({
            ...lens.prop('items').prop(task.id).toProps(), // pass IEditable to each row to allow editing
            isSelectable: true,
            dnd: {
                srcData: task,
                dstData: task,
                canAcceptDrop: handleCanAcceptDrop,
                onDrop: handleDrop,
            },
        }),

        patch: Object.values(value.items),
        shouldApplyPatchComparator: (item) => !prevPatch?.[item.id] || !isEqual(prevPatch[item.id], value.items[item.id]),
    }, []);

    const columns = useMemo(() => getColumns({ insertTask, deleteTask: () => {} }), []);

    return <Panel style={ { width: '100%' } }>
        <FlexRow spacing='12' margin='12'>
            <FlexCell width='auto'>
                <IconButton icon={ insertAfter } onClick={ () => insertTask('top') } />
            </FlexCell>
            <FlexCell width='auto'>
                <IconButton icon={ insertBefore } onClick={ () => insertTask('bottom') } />
            </FlexCell>
            <FlexSpacer />
            <FlexCell width='auto'>
                <Button size='30' icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } />
            </FlexCell>
            <FlexCell width='auto'>
                <Button size='30' icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } />
            </FlexCell>
            <FlexCell width='auto'>
                <Button size='30' caption="Save" onClick={ save } isDisabled={ !isChanged } />
            </FlexCell>
            <FlexCell width='auto'>
                <Button size='30' caption="Revert" onClick={ revert } isDisabled={ !isChanged } />
            </FlexCell>
        </FlexRow>
        <DataTable
            headerTextCase='upper'
            getRows={ () => rows }
            columns={ columns }
            value={ tableState }
            onValueChange={ onTableStateChange }
            showColumnsConfig
            allowColumnsResizing
            allowColumnsReordering
            { ...listProps }
        />
    </Panel>;
};
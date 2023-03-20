import { DataTable, useForm, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton } from '@epam/promo';
import React, { useCallback, useMemo } from 'react';
import { AcceptDropParams, DataTableState, DropParams, DropPosition, ITree, Metadata, Tree, useList } from '@epam/uui-core';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/common/table-row_plus_after-24.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/common/table-row_plus_before-24.svg';
import { Task } from './types';
import { getDemoTasks } from './demoData';
import { getColumns } from './columns';
import { insertOrMoveTask } from './helpers';

interface FormState {
    items: ITree<Task, number>;
}

interface TaskSubtotals {
    totalEstimate: number;
}

const metadata: Metadata<FormState> = {
    props: {
        items: {
            props: {
                byId: {
                    all: {
                        props: {
                            name: {
                                isReadonly: true,
                            },
                        },
                    },
                },
            },
        },
    },
};

let savedValue: FormState = {
    items: Tree.create<Task, number>(
        { getId: i => i.id, getParentId: i => i.parentId },
        Object.values(getDemoTasks()),
    ),
};

export const ProjectDemo = () => {

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
            items: insertOrMoveTask(formState.items, position, relativeTask, existingTask),
        }));
    };

    const handleCanAcceptDrop = useCallback((params: AcceptDropParams<Task, Task>) => ({ bottom: true, top: true, inside: true }), []);

    const handleDrop = useCallback((params: DropParams<Task, Task>) => insertTask(params.position, params.dstData, params.srcData), []);

    const [tableState, setTableState] = React.useState<DataTableState>({ sorting: [{ field: 'order' }] });

    const { rows, listProps } = useList<Task, number, any, TaskSubtotals>({
        type: 'array',
        listState: tableState,
        setListState: setTableState,
        items: value.items,

        getId: i => i.id,
        getParentId: i => i.parentId,
        getRowOptions: (task) => ({
            ...lens.prop('items').getById(task.id).toProps(),
            isSelectable: true,
            dnd: {
                srcData: task,
                dstData: task,
                canAcceptDrop: handleCanAcceptDrop,
                onDrop: handleDrop,
            },
        }),

        subtotals: {
            // shouldCompute: (parent: Task) => true,
            schema: {
                totalEstimate: {
                    get: (item) => item.estimate ?? 0,
                    compute: (a, b) => a + b,
                },
            },
        },
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
            onValueChange={ setTableState }
            showColumnsConfig
            allowColumnsResizing
            allowColumnsReordering
            { ...listProps }
        />
    </Panel>;
};
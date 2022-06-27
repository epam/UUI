import { DataTable, useForm, Panel, Button, FlexCell, FlexRow, FlexSpacer, IconButton } from '@epam/promo';
import React, { useCallback } from 'react';
import { AcceptDropParams, DataQueryFilter, DataTableState, DropParams, Metadata, useArrayDataSource, useTableState } from '@epam/uui-core';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
import { ReactComponent as insertAfter } from '@epam/assets/icons/common/table-row_plus_after-24.svg';
import { ReactComponent as insertBefore } from '@epam/assets/icons/common/table-row_plus_before-24.svg';
import { Task } from './types';
import { getDemoTasks } from './demoData';
import { columns } from './columns';

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

export const ProjectDemo = () => {
    const { lens, value, onValueChange, save, isChanged, revert, undo, canUndo, redo, canRedo } = useForm<FormState>({
        value: savedValue,
        onSave: async (value) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            savedValue = value;
        },
        getMetadata: () => metadata,
    });

    const handleCanAcceptDrop = useCallback((params: AcceptDropParams<Task, Task>) => ({ bottom: true, top: true, inside: true }), []);

    const handleDrop = useCallback((params: DropParams<Task, Task>) => console.log(params), []);

    const insertNew = (parentId: number) => {
        const newTask: Task = { id: lastId--, name: '', parentId };
        onValueChange({ ...value, items: { ...value.items, [newTask.id]: newTask }});
    }

    //const { tableState, setTableState } = useTableState<any>({ columns });
    const [ tableState, setTableState] = React.useState<DataTableState>({});

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
                srcData: task.id,
                dstData: task.id,
                canAcceptDrop: handleCanAcceptDrop,
                onDrop: handleDrop,
            },
        }),
        sortBy: t => t.order,
    });

    return <Panel style={ { width: '100%' } }>
        <FlexRow spacing='12' margin='12'>
            <FlexCell width='auto'>
                <IconButton icon={ insertAfter } onClick={() => insertNew(null)} />
            </FlexCell>
            <FlexCell width='auto'>
                <IconButton icon={ insertBefore } onClick={() => {}} />
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
            getRows={ dataView.getVisibleRows }
            columns={ columns }
            value={ tableState }
            onValueChange={ setTableState }
            showColumnsConfig
            allowColumnsResizing
            allowColumnsReordering
            showCellDivider={ false }
            { ...dataView.getListProps() }
        />
    </Panel>;
};
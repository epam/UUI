import { DataTable, useForm, Panel, Button, FlexCell, FlexRow, FlexSpacer } from '@epam/promo';
import React from 'react';
import { DataQueryFilter, Metadata, useArrayDataSource, useTableState } from '@epam/uui-core';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';
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

let savedValue: FormState = { items: getDemoTasks() };

export const ProjectDemo = () => {
    const { lens, value, save, isChanged, revert, undo, canUndo, redo, canRedo } = useForm<FormState>({
        value: savedValue,
        onSave: async (value) => {
            // At this point you usually call api.saveSomething(value) to actually send changed data to server
            savedValue = value;
        },
        getMetadata: () => metadata,
    });

    const { tableState, setTableState } = useTableState<any>({ columns });

    const dataSource = useArrayDataSource<Task, number, DataQueryFilter<Task>>({
        items: Object.values(value.items),
        getId: i => i.id,
        getParentId: i => i.parentId,
    }, [value.items]);

    const dataView = dataSource.useView(tableState, setTableState, {
        getRowLens: (id) => lens.prop('items').prop(id),
        getRowOptions: (row) => ({
            checkbox: { isVisible: true },
            dnd: {
                srcData: row.id,
                dstData: row.id,
                canAcceptDrop: (params) => ({ bottom: true, top: true, inside: true }),
                onDrop: (data) => console.log(data),
            },
        }),
    });

    return <Panel style={ { width: '100%' } }>
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
        {
            isChanged && <FlexRow spacing='12' margin='12'>
                <FlexSpacer />
                <FlexCell width='auto'>
                    <Button icon={ undoIcon } onClick={ undo } isDisabled={ !canUndo } />
                </FlexCell>
                <FlexCell width='auto'>
                    <Button icon={ redoIcon } onClick={ redo } isDisabled={ !canRedo } />
                </FlexCell>
                <FlexCell width='auto'>
                    <Button caption="Save" onClick={ save } />
                </FlexCell>
                <FlexCell width='auto'>
                    <Button caption="Revert" onClick={ revert } />
                </FlexCell>
            </FlexRow>
        }
    </Panel>;
};
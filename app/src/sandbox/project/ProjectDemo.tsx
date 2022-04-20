import { DataTable, useForm, Panel, Button, FlexCell, FlexRow, FlexSpacer, DataTableCell, TextInput, NumericInput  } from 'epam-promo';
import React from 'react';
import { DataColumnProps, DataQueryFilter, Metadata, useArrayDataSource, useTableState } from 'uui-core';
import { ReactComponent as undoIcon } from '@epam/assets/icons/common/content-edit_undo-18.svg';
import { ReactComponent as redoIcon } from '@epam/assets/icons/common/content-edit_redo-18.svg';

interface Task {
    id: number;
    parentId?: number;
    name: string;
    estimate?: number;
}

const columns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
    {
        key: 'name',
        caption: 'Name',
        width: 200,
        fix: 'left',
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('name') }
            renderEditor={({ editorProps }) => <TextInput mode='cell' { ...editorProps } /> }
            { ...props }
        />,
    },
    {
        key: 'estimate',
        textAlign: 'right',
        caption: 'Estimate',
        info: "Estimate in man/days",
        width: 200,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('estimate') }
            renderEditor={({ editorProps }) => <NumericInput mode='cell' { ...editorProps } min={ 0 } max={ 100500 } /> }
            { ...props }
        />,
    },
];

interface FormState {
    items: Record<number, Task>;
}

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    name: { isRequired: true }
                }
            }
        }
    }
}

let savedValue: FormState = { items: {
    1: { id: 1, name: "Parent" },
    2: { id: 2, name: "Child 1", parentId: 1 },
    3: { id: 3, name: "Child 2", parentId: 1 },
} };

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

    return <Panel style={{ width: '100%' }}>
        <DataTable
            headerTextCase='upper'
            getRows={ dataView.getVisibleRows }
            columns={ columns }
            value={ tableState }
            onValueChange={ setTableState }
            showColumnsConfig
            allowColumnsResizing
            allowColumnsReordering
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
}
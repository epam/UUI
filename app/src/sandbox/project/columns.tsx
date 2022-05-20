import { Task, Resource } from "./types";
import { resources } from './demoData';
import React from "react";
import { DataTableCell, TextInput, NumericInput, PickerInput, DatePicker, Checkbox, TextArea } from '@epam/promo';
import { ArrayDataSource, DataColumnProps, DataQueryFilter } from "@epam/uui-core";

const resourceDataSource = new ArrayDataSource({ items: resources });

export const taskColumns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
    {
        key: 'name',
        caption: 'Name',
        width: 400,
        fix: 'left',
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('name') }
            renderEditor={ ({ editorProps }) => <TextInput mode='cell' { ...editorProps } /> }
            { ...props }
        />,
    },
    {
        key: 'estimate',
        textAlign: 'right',
        caption: 'Estimate',
        info: "Estimate in man/days",
        width: 120,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            acceptReplication="vertical"
            getLens={ l => l.prop('estimate') }
            renderEditor={ ({ editorProps }) => <NumericInput mode='cell' { ...editorProps } min={ 0 } max={ 100500 } /> }
            { ...props }
        />,
    },
];

export const columns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
    ...taskColumns,
    {
        key: 'resource',
        caption: 'Resource',
        width: 200,
        isSortable: true,
        renderCell: (props) => <DataTableCell
        getLens={ l => l.prop('resource') }
        renderEditor={ ({ editorProps }) => (
            <PickerInput mode='cell' valueType="id" selectionMode="multi" dataSource={ resourceDataSource } { ...editorProps } />
        ) }
        { ...props }
        />,
    },
    {
        key: 'startDate',
        caption: 'Start date',
        width: 150,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('startDate') }
            renderEditor={ ({ editorProps }) => (
                <DatePicker mode='cell' format='MMM D, YYYY' { ...editorProps } />
            ) }
            { ...props }
        />,
    },
    {
        key: 'isDone',
        caption: 'Done',
        width: 100,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('isDone') }
            renderEditor={ ({ editorProps }) => (
                <Checkbox { ...editorProps } />
            ) }
            { ...props }
        />,
    },
    {
        key: 'complete',
        caption: '%, Complete',
        width: 130,
        renderCell: (props) => <DataTableCell
            acceptReplication="vertical"
            getLens={ l => l.prop('complete') }
            renderEditor={ ({ editorProps }) => (
                <NumericInput mode={ 'cell' } min={ 0 } max={ 100 } { ...editorProps } />
            ) }
            { ...props }
        />,
    },
    {
        key: 'description',
        caption: 'Description',
        width: 200,
        grow: 1,
        renderCell: (props) => <DataTableCell
            getLens={ l => l.prop('description') }
            renderEditor={ ({ editorProps }) => (
                <TextArea { ...editorProps } autoSize={ true } mode='cell' />
            ) }
            { ...props }
        />,
    },
];
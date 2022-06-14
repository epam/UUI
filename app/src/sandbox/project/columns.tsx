import { Task, Resource } from "./types";
import { resources } from './demoData';
import React from "react";
import { DataTableCell, TextInput, NumericInput, PickerInput, DatePicker, Checkbox, TextArea } from '@epam/promo';
import { ArrayDataSource, DataColumnProps, DataQueryFilter } from "@epam/uui-core";

const resourceDataSource = new ArrayDataSource({ items: resources });

export const columns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
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
            acceptCopyDirection="vertical"
            canCopyTo={ ({ rowIndex }) => true } // Just Example
            getLens={ l => l.prop('estimate') }
            background={ 'blue' }
            renderEditor={ ({ editorProps }) => <NumericInput
                mode='cell'
                { ...editorProps }
                max={ 10000000500 }
                formatOptions={ { maximumFractionDigits: 2, minimumFractionDigits: 2 } }
            /> }
            { ...props }
        />,
    },
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
            acceptCopyDirection="vertical"
            getLens={ l => l.prop('complete') }
            renderEditor={ ({ editorProps }) => (
                <NumericInput mode={ 'cell' } max={ 100 } { ...editorProps } formatOptions={ { maximumFractionDigits: 0 } }/>
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
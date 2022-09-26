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
            { ...props.rowLens.prop('name').toProps() }
            renderEditor={ props => <TextInput { ...props } /> }
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
            { ...props.rowLens.prop('estimate').toProps() }
            background={ 'green' }
            renderEditor={ props => <NumericInput
                { ...props }
                formatOptions={ { maximumFractionDigits: 1 } }
            /> }
            { ...props }

        />,
    },
    {
        key: 'resource',
        caption: 'Resources',
        width: 300,
        isSortable: true,
        renderCell: (props) => <DataTableCell
            { ...props.rowLens.prop('resource').toProps() }
            renderEditor={ props => (
                <PickerInput valueType="id" selectionMode="multi" dataSource={ resourceDataSource } { ...props } />
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
            { ...props.rowLens.prop('startDate').toProps() }
            renderEditor={ props => (
                <DatePicker format='MMM D, YYYY' { ...props } />
            ) }
            { ...props }
        />,
    },
    {
        key: 'isDone',
        caption: 'Done',
        width: 100,
        isSortable: true,
        justifyContent: 'center',
        renderCell: (props) => <DataTableCell
            { ...props.rowLens.prop('isDone').toProps() }
            renderEditor={ props => (
                <Checkbox { ...props } />
            ) }
            { ...props }
        />,
    },
    {
        key: 'complete',
        caption: '% Complete',
        width: 130,
        renderCell: (props) => <DataTableCell
            { ...props.rowLens.prop('complete').toProps() }
            renderEditor={ props => (
                <NumericInput max={ 100 } { ...props } formatOptions={ { maximumFractionDigits: 0 } }/>
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
            { ...props.rowLens.prop('description').toProps() }
            renderEditor={ props => (
                <TextArea { ...props } autoSize={ true } />
            ) }
            { ...props }
        />,
    },
];
import { Task, TasksSummary, InsertTaskCallback, ColumnsProps } from "./types";
import { resources } from './demoData';
import React from "react";
import { DataTableCell, Text, TextInput, NumericInput, PickerInput, DatePicker, Checkbox, TextArea, DataPickerRow, PickerItem, FlexRow } from '@epam/promo';
import { ArrayDataSource, DataColumnProps, DataQueryFilter } from "@epam/uui-core";
import { RowKebabButton } from "./RowKebabButton";

const resourceDataSource = new ArrayDataSource({ items: resources });

export function getColumns(columnsProps: ColumnsProps) {
    const taskColumns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
        {
            key: 'name',
            caption: 'Name',
            width: 400,
            fix: 'left',
            isSortable: true,
            renderCell: (props) => <DataTableCell
                padding='12'
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
                { ...props.rowLens.prop('resources').toProps() }
                renderEditor={ props => (
                    <PickerInput
                        valueType="id"
                        selectionMode="multi"
                        dataSource={ resourceDataSource }
                        renderRow={ props => <DataPickerRow
                            { ...props }
                            renderItem={ (item) => <PickerItem title={ item.name } subtitle={ item.fullName } { ...props } /> }
                        /> }
                        placeholder=""
                        { ...props }
                    />
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
                    <DatePicker
                        format='MMM D, YYYY'
                        placeholder=""
                        { ...props }
                    />
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
                    <NumericInput max={ 100 } { ...props } formatOptions={ { maximumFractionDigits: 0 } } />
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
        {
            key: 'actions',
            render: (item, row) => <RowKebabButton row={ row } { ...columnsProps } />,
            width: 54,
            fix: 'right',
            alignSelf: 'center',
        },
    ];


    const summaryColumns: DataColumnProps<TasksSummary>[] = [
        {
            key: 'name',
            caption: "Total Count",
            fix: 'left',
            textAlign: 'right',
            width: 400,
            grow: 1,
            render: p => (
                <FlexRow background='white'>
                    <Text fontSize='14' font='sans-semibold' color='gray90'>Total { p.totalCount || 0 } records</Text>
                </FlexRow>
            ),
        },
        {
            key: 'estimate',
            textAlign: 'right',
            caption: 'Estimate',
            info: "Estimate in man/days",
            width: 120,
            grow: 1,
            render: p => <Text font='sans-semibold' fontSize='14'>{ p.totalEstimate }</Text>,
        },
        {
            key: 'resource',
            width: 300,
            grow: 1,
            render: () => <Text fontSize='14' font='sans-semibold'>-</Text>,
        },
        {
            key: 'startDate',
            render: () => <Text fontSize='14'>-</Text>,
            width: 150,
        },
        {
            key: 'isDone',
            render: () => <Text fontSize='14'>-</Text>,
            width: 100,
        },
        {
            key: 'complete',
            render: () => <Text fontSize='14'>-</Text>,
            width: 130,
            grow: 1,
        },
        {
            key: 'description',
            render: () => <Text fontSize='14'>-</Text>,
            width: 200,
            grow: 1,
        },
        {
            key: 'actions',
            render: p => null,
            width: 54,
            fix: 'right',
        },
    ];

    return { taskColumns, summaryColumns };
}
import React from 'react';
import {
    DataTableCell, TextInput, NumericInput, PickerInput, DatePicker, DataPickerRow, PickerItem,
} from '@epam/uui';
import { TextArea } from '@epam/promo';
import { ArrayDataSource, DataColumnProps, DataQueryFilter } from '@epam/uui-core';
import { Task, SelectedCellData } from './types';
import { status } from './demoData';

const resourceDataSource = new ArrayDataSource({ items: status });

const isSameColumn = (from: SelectedCellData, to: SelectedCellData) => from.column.key === to.column.key;

export function getColumns() {
    const columns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
        {
            key: 'name',
            caption: 'Name',
            width: 300,
            fix: 'left',
            isSortable: true,
            renderCell: (props) => (
                <DataTableCell columnsGap="12" { ...props.rowLens.prop('title').toProps() } renderEditor={ (props) => <TextInput { ...props } /> } { ...props } />
            ),
        }, {
            key: 'description',
            caption: 'Description',
            width: 200,
            grow: 1,
            canCopy: () => true,
            canAcceptCopy: isSameColumn,
            renderCell: (props) => (
                <DataTableCell { ...props.rowLens.prop('description').toProps() } renderEditor={ (props) => <TextArea { ...props } autoSize={ true } /> } { ...props } />
            ),
        }, {
            key: 'estimate',
            textAlign: 'right',
            caption: 'Estimate',
            info: 'Estimate in man/days',
            width: 120,
            isSortable: true,
            canCopy: () => true,
            canAcceptCopy: (from) => ['estimate', 'complete'].includes(from.column.key),
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('estimate').toProps() }
                    renderEditor={ (props) => <NumericInput { ...props } formatOptions={ { maximumFractionDigits: 1 } } /> }
                    { ...props }
                />
            ),
        }, {
            key: 'complete',
            textAlign: 'right',
            caption: 'Complete',
            info: 'Completed in man/days',
            width: 130,
            isSortable: true,
            canCopy: () => true,
            canAcceptCopy: (from) => ['estimate', 'complete'].includes(from.column.key),
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('complete').toProps() }
                    renderEditor={ (props) => <NumericInput { ...props } formatOptions={ { maximumFractionDigits: 1 } } /> }
                    { ...props }
                />
            ),
        }, {
            key: 'status',
            caption: 'Status',
            width: 150,
            isSortable: true,
            canCopy: () => true,
            canAcceptCopy: isSameColumn,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('status').toProps() }
                    renderEditor={ (props) => (
                        <PickerInput
                            valueType="id"
                            selectionMode="single"
                            dataSource={ resourceDataSource }
                            renderRow={ (props) => (
                                <DataPickerRow
                                    { ...props }
                                    key={ props.key }
                                    renderItem={ (item) => <PickerItem { ...props } title={ item.name } subtitle={ item.name } /> }
                                />
                            ) }
                            placeholder=""
                            { ...props }
                        />
                    ) }
                    { ...props }
                />
            ),
        }, {
            key: 'startDate',
            caption: 'Start date',
            width: 200,
            isSortable: true,
            canCopy: () => true,
            canAcceptCopy: (from) => ['startDate', 'endDate'].includes(from.column.key),
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('startDate').toProps() }
                    renderEditor={ (props) => <DatePicker format="MMM D, YYYY" placeholder="" { ...props } /> }
                    { ...props }
                />
            ),
        }, {
            key: 'endDate',
            caption: 'End date',
            width: 200,
            isSortable: true,
            canCopy: () => true,
            canAcceptCopy: (from) => ['startDate', 'endDate'].includes(from.column.key),
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('endDate').toProps() }
                    renderEditor={ (props) => <DatePicker format="MMM D, YYYY" placeholder="" { ...props } /> }
                    { ...props }
                />
            ),
        }, {
            key: 'detailed',
            render: () => <></>,
            width: 54,
            alignSelf: 'center',
            fix: 'right',
        },
    ];

    return columns;
}

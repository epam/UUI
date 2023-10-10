import { Task, ColumnsProps } from './types';
import { resources, statuses } from './demoData';
import React from 'react';
import { TextArea, PickerToggler, TextInput, DataTableCell, NumericInput, PickerInput,
    DatePicker, DataPickerRow, PickerItem, IconContainer } from '@epam/promo';
import { ArrayDataSource, DataColumnProps, DataQueryFilter } from '@epam/uui-core';
import { ReactComponent as statusIcon } from '@epam/assets/icons/common/radio-point-10.svg';

import { RowKebabButton } from './RowKebabButton';

const resourceDataSource = new ArrayDataSource({ items: resources });
const statusDataSource = new ArrayDataSource({ items: statuses });

export function getColumns(columnsProps: ColumnsProps) {
    const columns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
        {
            key: 'name',
            caption: 'Name',
            width: 300,
            fix: 'left',
            isSortable: true,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('name').toProps() }
                    renderEditor={ (props) => <TextInput { ...props } /> }
                    { ...props }
                />
            ),
        },
        {
            key: 'estimate',
            textAlign: 'right',
            caption: 'Estimate',
            info: 'Estimate in man/days',
            width: 120,
            isSortable: true,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('estimate').toProps() }
                    renderEditor={ (props) => <NumericInput { ...props } formatOptions={ { maximumFractionDigits: 1 } } /> }
                    { ...props }
                />
            ),
        },
        {
            key: 'status',
            caption: 'Status',
            width: 160,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('status').toProps() }
                    size="24"
                    renderEditor={ (props) => (
                        <PickerInput
                            valueType="id"
                            placeholder="Add Status"
                            dataSource={ statusDataSource }
                            selectionMode="single"
                            renderRow={ (props) => (
                                <DataPickerRow
                                    { ...props }
                                    renderItem={ (item) => (
                                        <PickerItem
                                            title={ item.name }
                                            icon={ () => <IconContainer icon={ statusIcon } style={ { fill: item.color } } /> }
                                            { ...props }
                                        />
                                    ) }
                                />
                            ) }
                            renderToggler={ (togglerProps) => {
                                const row = togglerProps.selection?.[0];
                                return (
                                    <PickerToggler
                                        { ...props }
                                        { ...togglerProps }
                                        icon={ () => <IconContainer icon={ statusIcon } style={ { fill: row?.value?.color ?? '#E1E3EB', paddingLeft: '17px' } } /> }
                                        iconPosition="left"
                                    />
                                );
                            } }
                            { ...props }
                        />
                    ) }
                    { ...props }
                />
            ),
        },
        {
            key: 'startDate',
            caption: 'Start date',
            width: 150,
            isSortable: true,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('startDate').toProps() }
                    renderEditor={ (props) => <DatePicker format="MMM D, YYYY" placeholder="" { ...props } /> }
                    { ...props }
                />
            ),
        },
        {
            key: 'dueDate',
            caption: 'Due date',
            width: 150,
            isSortable: true,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('dueDate').toProps() }
                    renderEditor={ (props) => <DatePicker format="MMM D, YYYY" placeholder="" { ...props } /> }
                    { ...props }
                />
            ),
        },
        {
            key: 'teams',
            caption: 'Teams',
            width: 220,
            isSortable: true,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('resources').toProps() }
                    renderEditor={ (props) => (
                        <PickerInput
                            valueType="id"
                            selectionMode="multi"
                            dataSource={ resourceDataSource }
                            renderRow={ (props) => (
                                <DataPickerRow
                                    { ...props }
                                    renderItem={ (item) => (
                                        <PickerItem
                                            title={ item.name }
                                            subtitle={ item.fullName }
                                            { ...props }
                                        />
                                    ) }
                                />
                            ) }
                            placeholder=""
                            { ...props }
                        />
                    ) }
                    { ...props }
                />
            ),
        },
        {
            key: 'description',
            caption: 'Description',
            width: 200,
            grow: 1,
            renderCell: (props) => (
                <DataTableCell { ...props.rowLens.prop('description').toProps() } renderEditor={ (props) => <TextArea { ...props } autoSize={ true } /> } { ...props } />
            ),
        },
        {
            key: 'actions',
            render: (item, row) => <RowKebabButton row={ row } { ...columnsProps } />,
            width: 54,
            fix: 'right',
            alignSelf: 'center',
        },
    ];

    return columns;
}

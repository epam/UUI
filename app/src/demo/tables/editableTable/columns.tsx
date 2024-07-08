import { Task, ColumnsProps } from './types';
import { resources, statuses } from './demoData';
import React from 'react';
import { TextArea, PickerToggler, TextInput, DataTableCell, NumericInput, PickerInput,
    DatePicker, DataPickerRow, PickerItem, IconContainer, 
    DataTableTimelineHeaderCell } from '@epam/uui';
import { ArrayDataSource, DataColumnProps, DataQueryFilter, IEditableDebouncer } from '@epam/uui-core';
import { ReactComponent as statusIcon } from '@epam/assets/icons/common/radio-point-10.svg';

import { RowKebabButton } from './RowKebabButton';
import css from './ProjectTableDemo.module.scss';
import { TimelineController } from '@epam/uui-timeline';
import { TimelineHeader } from './TimelineHeader';

import { TaskRow } from './TaskRow';

const resourceDataSource = new ArrayDataSource({ items: resources });
const statusDataSource = new ArrayDataSource({ items: statuses });

export function getColumnsTableMode(columnsProps: ColumnsProps) {
    const columns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
        {
            key: 'name',
            caption: 'Name',
            width: 300,
            fix: 'left',
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
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('estimate').toProps() }
                    renderEditor={ (props) => (
                        <IEditableDebouncer
                            { ...props }
                            render={ (editableProps) => {
                                return (
                                    <NumericInput
                                        { ...props }
                                        formatOptions={ { maximumFractionDigits: 1 } }
                                        { ...editableProps }
                                    />
                                );
                            } }
                        />    
                    ) }
                    { ...props }
                />
            ),
        },
        {
            key: 'status',
            caption: 'Status',
            width: 160,
            minWidth: 150,
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
                            minBodyWidth={ 150 }
                            renderRow={ (props) => (
                                <DataPickerRow
                                    { ...props }
                                    padding="12"
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
                                const fill = row?.value?.color && togglerProps.value && row?.value?.name?.includes(togglerProps.value)
                                    ? row?.value?.color
                                    : '#E1E3EB';
                        
                                return (
                                    <PickerToggler
                                        { ...props }
                                        { ...togglerProps }
                                        icon={ () => <IconContainer icon={ statusIcon } style={ { fill: fill, marginBottom: '0' } } cx={ css.statusIcon } /> }
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
            caption: 'Assignee',
            width: 220,
            allowResizing: false,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('assignee').toProps() }
                    renderEditor={ (props) => (
                        <PickerInput
                            valueType="id"
                            selectionMode="single"
                            dataSource={ resourceDataSource }
                            emptyValue={ undefined }
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
            allowResizing: false,
            renderCell: (props) => (
                <DataTableCell { ...props.rowLens.prop('description').toProps() } renderEditor={ (props) => <TextArea { ...props } autoSize={ true } /> } { ...props } />
            ),
        },
        {
            key: 'actions',
            render: (_, row) => <RowKebabButton row={ row } { ...columnsProps } />,
            width: 54,
            fix: 'right',
            alignSelf: 'center',
            allowResizing: false,
        },
    ];

    return columns;
}

export function getColumnsTimelineMode(columnsProps: ColumnsProps & { timelineController: TimelineController }) {
    const { timelineController } = columnsProps;
    const columns: DataColumnProps<Task, number, DataQueryFilter<Task>>[] = [
        {
            key: 'name',
            caption: 'Name1',
            width: 300,
            fix: 'left',
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
            width: 100,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('estimate').toProps() }
                    renderEditor={ (editorProps) => (
                        <IEditableDebouncer
                            { ...editorProps }
                            render={ (editableProps) => {
                                return (
                                    <NumericInput
                                        { ...editorProps }
                                        formatOptions={ { maximumFractionDigits: 1 } }
                                        { ...editableProps }
                                        isDisabled={ props.rowLens.prop('type').get() === 'story' }
                                    />
                                );
                            } }
                        />    
                    ) }
                    { ...props }
                />
            ),
        },
        {
            key: 'status',
            caption: 'Status',
            width: 150,
            minWidth: 150,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('status').toProps() }
                    size="24"
                    renderEditor={ (editorProps) => (
                        <PickerInput
                            valueType="id"
                            placeholder="Add Status"
                            dataSource={ statusDataSource }
                            selectionMode="single"
                            minBodyWidth={ 150 }
                            isDisabled={ props.rowLens.prop('type').get() === 'story' }
                            renderRow={ (props) => (
                                <DataPickerRow
                                    { ...props }
                                    padding="12"
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
                                const fill = row?.value?.color && togglerProps.value && row?.value?.name?.includes(togglerProps.value)
                                    ? row?.value?.color
                                    : '#E1E3EB';
                        
                                return (
                                    <PickerToggler
                                        { ...props }
                                        { ...togglerProps }
                                        isDisabled={ props.rowLens.prop('type').get() === 'story' }
                                        icon={ () => <IconContainer icon={ statusIcon } style={ { fill: fill, marginBottom: '0' } } cx={ css.statusIcon } /> }
                                        iconPosition="left"
                                    />
                                );
                            } }
                            { ...editorProps }
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
            allowResizing: false,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('startDate').toProps() }
                    renderEditor={ (editorProps) => <DatePicker format="MMM D, YYYY" placeholder="" { ...editorProps } isDisabled={ props.rowLens.prop('type').get() === 'story' } /> }
                    { ...props }
                />
            ),
        },
        {
            key: 'dueDate',
            caption: 'Due date',
            width: 150,
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('dueDate').toProps() }
                    renderEditor={ (editorProps) => (
                        <DatePicker format="MMM D, YYYY" placeholder="" { ...editorProps } isDisabled={ props.rowLens.prop('type').get() === 'story' } />
                    ) }
                    { ...props }
                />
            ),
        },
        {
            key: 'task',
            width: 200,
            grow: 1,
            allowResizing: false,
            renderHeaderCell(props) {
                return (
                    <DataTableTimelineHeaderCell { ...props }>
                        <TimelineHeader timelineController={ timelineController } />
                    </DataTableTimelineHeaderCell>
                );
            },
            renderCell(props) {
                return (
                    <TaskRow task={ props.rowLens.toProps().value } timelineController={ timelineController } />
                );
            },
        },
        {
            key: 'actions',
            render: (_, row) => <RowKebabButton row={ row } { ...columnsProps } />,
            width: 54,
            fix: 'right',
            alignSelf: 'center',
            allowResizing: false,
        },
    ];

    return columns;
}

import React from 'react';
import { DataColumnProps } from '@epam/uui-core';
import { DataTableCell, TextInput, Text } from '@epam/promo';

export const dataSourceColumns: DataColumnProps<{ name: string }, number, any>[] = [
    {
        key: 'name',
        caption: 'Name',
        width: 290,
        fix: 'left',
        renderCell: (props) => (
            <DataTableCell
                { ...props.rowLens.prop('name').toProps() }
                renderEditor={ (props) => <TextInput { ...props } /> }
                padding="12"
                { ...props }
            />
        ),
    },
];

export const sortableDataSourceColumns: DataColumnProps<{ name: string }, number, any>[] = [
    {
        key: 'name',
        caption: 'Name',
        width: 290,
        fix: 'left',
        isSortable: true,
        renderCell: (props) => (
            <DataTableCell
                { ...props.rowLens.prop('name').toProps() }
                renderEditor={ (props) => <TextInput { ...props } /> }
                padding="12"
                { ...props }
            />
        ),
    },
];

export const dataSourceTextColumns: DataColumnProps<{ name: string }, number, any>[] = [
    {
        key: 'name',
        caption: 'Name',
        width: 290,
        fix: 'left',
        render: (props) => <Text>{props.name}</Text>,
    },
];

import React from 'react';
import { DataColumnProps } from '@epam/uui-core';
import { DataTableCell, TextInput, Text } from '@epam/promo';

export const columns: DataColumnProps<{ name: string }, number, any>[] = [
    {
        key: 'name',
        caption: 'Name',
        width: 290,
        fix: 'left',
        renderCell: (props) => {
            console.log(props);
            return (
                <DataTableCell
                    { ...props.rowLens.prop('name').toProps() }
                    renderEditor={ (props) => <TextInput isDisabled={ props.rowProps.isDisabled } { ...props } /> }
                    { ...props }
                />
            );
        },
    },
];

export const textColumns: DataColumnProps<{ name: string }, number, any>[] = [
    {
        key: 'name',
        caption: 'Name',
        width: 290,
        fix: 'left',
        renderCell: (props) => (
            <DataTableCell
                { ...props.rowLens.prop('name').toProps() }
                renderEditor={ (props) => <Text>{props.value }</Text> }
                { ...props }
            />
        ),
    },
];

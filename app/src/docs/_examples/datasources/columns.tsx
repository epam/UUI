import React from 'react';
import { DataColumnProps } from '@epam/uui-core';
import { DataTableCell, TextInput } from '@epam/promo';

export const columns: DataColumnProps<{ name: string }, number, any>[] = [
    {
        key: 'name',
        caption: 'Name',
        width: 290,
        fix: 'left',
        renderCell: (props) => (
            <DataTableCell
                { ...props.rowLens.prop('name').toProps() }
                renderEditor={ (props) => <TextInput { ...props } /> }
                { ...props }
            />
        ),
    },
];

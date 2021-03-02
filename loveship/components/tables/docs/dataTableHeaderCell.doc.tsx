import React from 'react';
import { DataTableHeaderCell } from '../DataTableHeaderCell';
import { DataTableHeaderCellProps } from '@epam/uui';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext, ResizableContext, FormContext, GridContext } from '../../../docs';
import { Text, DataTableHeaderCellMods } from '../../../components';

const DataTableHeaderCellDoc = new DocBuilder<DataTableHeaderCellProps<any, any> & DataTableHeaderCellMods>({ name: 'DataTableHeaderCell', component: DataTableHeaderCell as any })
    .prop('column', {
        examples: [
            {
                name: 'country',
                value: {
                    key: 'name',
                    caption: 'Name',
                    render: () => <Text size='24'>first</Text>,
                    width: 150,
                    fix: 'left',
                },
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .prop('isFirstColumn', {
        examples: [true, false],
    })
    .prop('isLastColumn', {
        examples: [true, false],
    })
    .prop('isFilterActive', {
        examples: [true, false],
    })
    .prop('isDropdown', {
        examples: [true, false],
    })
    .prop('selectAll', {
        examples: [{ value: true, onValueChange: () => { } }],
    })
    .prop('onSort', {
        examples: [
            {
                name: 'sort',
                value: () => alert('sort'),
            },
        ],
    })
    .prop('size', {
        examples: ['24', '30', '36', '48', '60'],
    })
    .withContexts(ResizableContext, DefaultContext, FormContext, GridContext);

export = DataTableHeaderCellDoc;
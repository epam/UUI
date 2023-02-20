import * as React from 'react';
import { DataTableCellProps } from '@epam/uui-core';
import { DocBuilder } from '@epam/uui-docs';
import { DataTableCell } from '@epam/promo';
import { DefaultContext, ResizableContext, FormContext, TableContext } from '../../docs';
import { Text, DataTableCellMods } from '@epam/promo';

const DataTableCellDoc = new DocBuilder<DataTableCellProps & DataTableCellMods>({ name: 'DataTableCell', component: DataTableCell as any })
    .prop('column', {
        examples: [
            {
                name: 'country',
                value: {
                    key: 'name',
                    caption: 'Name',
                    render: () => <Text size="24">first</Text>,
                    width: 150,
                    fix: 'left',
                },
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .prop('size', {
        examples: ['60'],
    })
    .prop('rowProps', {
        examples: [
            {
                name: 'example',
                value: {
                    id: '1',
                    rowKey: '1',
                    index: 0,
                },
                isDefault: true,
            },
        ],
        isRequired: true,
    })
    .withContexts(ResizableContext, DefaultContext, FormContext, TableContext);

export default DataTableCellDoc;

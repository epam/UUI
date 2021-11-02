import { DataTableHeaderRow } from '../DataTableHeaderRow';
import { DataTableHeaderRowProps } from '@epam/uui';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext, ResizableContext, FormContext, GridContext, iEditable } from '../../../docs';
import { ColumnsHeaderRowDoc } from './common';
import { TableContext } from './TableContext';
import { DataTableHeaderRowMods } from '..';

const DataTableHeaderRowDoc = new DocBuilder<DataTableHeaderRowProps<any, any> & DataTableHeaderRowMods>({ name: 'DataTableHeaderRow', component: DataTableHeaderRow as any })
    .implements([ColumnsHeaderRowDoc, iEditable] as any)
    .prop('size', {
        examples: ['30', '36'],
        defaultValue: '36',
    })
    .prop('textCase', {
        examples: ['upper', 'normal'],
    })
    .prop('onConfigButtonClick', {
        examples: [
            {
                name: 'example',
                value: () => alert('click'),
            },
        ],
    })
    .prop('value', {
        examples: [
            {
                name: 'example',
                value: {
                    sorting: [{ field: 'name', direction: 'asc' }],
                },
                isDefault: true,
            },
        ],
    })
    .withContexts(TableContext, ResizableContext, DefaultContext, FormContext, GridContext);

export = DataTableHeaderRowDoc;
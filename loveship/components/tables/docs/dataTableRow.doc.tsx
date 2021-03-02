import React from 'react';
import { DataTableRow } from '../DataTableRow';
import { DocBuilder, demoData } from '@epam/uui-docs';
import { DefaultContext, ResizableContext, ColorPicker } from '../../../docs';
import { DataTableRowProps } from '@epam/uui-components';
import { ColumnsHeaderRowDoc } from './common';
import { TableContext } from './TableContext';
import { commonControlColors, DataTableRowMods } from '../..';
import { colors } from '../../../helpers/colorMap';

const DataTableRowDoc = new DocBuilder<DataTableRowProps<any, any> & DataTableRowMods>({ name: 'DataTableRow', component: DataTableRow as any })
    .implements([ColumnsHeaderRowDoc] as any)
    .prop('value', {
        examples: [
            { name: 'person', value: demoData.personDemoData[1] },
        ],
        isRequired: true,
    })
    .prop('isFoldable', {
        examples: [true, false],
        defaultValue: false,
    })
    .prop('isFolded', {
        examples: [true, false],
    })
    .prop('isSelected', {
        examples: [true, false],
    })
    .prop('isFocused', {
        examples: [true, false],
    })
    .prop('depth', {
        examples: [0, 1, 2, 3, 4, 5],
        defaultValue: 0,
    })
    .prop('checkbox', {
        examples: [
            {
                name: 'Can be checked',
                value: { isVisible: true },
            },
        ],
    })
    .prop('isChecked', {
        examples: [true, false],
    })
    .prop('isChildrenChecked', {
        examples: [true],
    })
    .prop('dnd', {
        examples: [{
            name: 'Can be dragged',
            value: { srcData: {} },
        }],
    })
    .prop('borderBottom', {
        examples: [{ name: "night100", value: "night300", isDefault: true }],
        defaultValue: "none",
    })
    .prop('onCheck', {
        examples: ctx => [ctx.getCallback('onCheck')],
       })
    .prop('onClick', {
         examples: ctx => [ctx.getCallback('onClick')],
        })
    .prop('onFold', {
        examples: ctx => [ctx.getCallback('onFold')],
       })
    .prop('onSelect', {
        examples: ctx => [ctx.getCallback('onSelect')],
       })
    .prop('size', {
        examples: [{ name: "30", value: "30", isDefault: true }, "36"],
        defaultValue: '36',
    })
    .prop('isLoading', {
        examples: [true],
    })
    .prop('reusePadding', {
        examples: [{ name: 'auto', value: 'auto', isDefault: true }, 'false'], defaultValue: 'auto',
    })
    .prop('background', {
        examples: ['night50', 'white'],
    })
    .prop('labelColor', { renderEditor: (editable: any, examples) => <ColorPicker colors={ examples.map(i => ({ value: i, hex: colors[i] })) } { ...editable } />, examples: commonControlColors })
    .withContexts(TableContext, ResizableContext, DefaultContext);

export = DataTableRowDoc;
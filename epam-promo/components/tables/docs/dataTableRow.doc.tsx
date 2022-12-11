import { DocBuilder, demoData } from '@epam/uui-docs';
import { DataTableRowProps } from '@epam/uui-core';
import { DefaultContext, ResizableContext } from '../../../docs';
import { DataTableRow, DataTableRowMods } from '../';
import { ColumnsHeaderRowDoc } from './common';
import { TableContext } from './TableContext';

const DataTableRowDoc = new DocBuilder<DataTableRowProps & DataTableRowMods>({ name: 'DataTableRow', component: DataTableRow })
    .implements([ColumnsHeaderRowDoc])
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
        examples: [{ name: 'Can be checked', value: { isVisible: true } }],
    })
    .prop('isChecked', {
        examples: [true, false],
    })
    .prop('isChildrenChecked', {
        examples: [true],
    })
    .prop('dnd', {
        examples: [{ name: 'Can be dragged', value: { srcData: {} } }],
    })
    .prop('borderBottom', {
        examples: [{ name: "gray30", value: "gray30", isDefault: true }],
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
    .withContexts(TableContext, ResizableContext, DefaultContext);

export default DataTableRowDoc;

import * as React from 'react';
import { PickerInputBaseProps } from '@epam/uui-components';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { DataPickerRow, PickerInputProps, PickerItem } from '@epam/uui';
import { PickerInput, Button, LinkButton, FlexCell, Text, SearchInput } from '@epam/promo';
import { iconDoc, iconOptionsDoc, iEditable, isDisabledDoc } from '../../docs';
import { DefaultContext, ResizableContext, IHasEditModeDoc, FormContext, TableContext } from '../../docs';
import { pickerBaseOptionsDoc } from './common';

const PickerInputDoc = new DocBuilder<PickerInputBaseProps<any, any> & PickerInputProps>({ name: 'PickerInput', component: PickerInput })
    .implements([
        isDisabledDoc, isReadonlyDoc, iEditable, pickerBaseOptionsDoc, IHasEditModeDoc, iconDoc, iconOptionsDoc,
    ])
    .prop('cascadeSelection', {
        examples: [
            true, 'explicit', 'implicit',
        ],
    })
    .prop('size', {
        examples: [
            '24', '30', '36', '42', '48',
        ],
        defaultValue: '36',
    })
    .prop('value', {
        examples: [
            { name: '1', value: 1 }, { name: '[1, 2]', value: [1, 2] }, { name: '{ id: 1, name: "Test"}', value: { id: 1, name: 'Test' } }, { name: '[{ id: 1, name: "Test"}]', value: [{ id: 1, name: 'Test' }] },
        ],
    })
    .prop('valueType', { examples: ['id', 'entity'], isRequired: true })
    .prop('selectionMode', { examples: ['single', 'multi'], isRequired: true })
    .prop('maxItems', {
        examples: [
            0, 1, 5, 10, 50, 100, 1000,
        ],
    })
    .prop('minCharsToSearch', {
        examples: [
            0, 1, 3, 5,
        ],
    })
    .prop('editMode', { examples: ['dropdown', 'modal'], isRequired: false, defaultValue: 'dropdown' })
    .prop('isInvalid', { examples: [true] })
    .prop('isSingleLine', { examples: [true] })
    .prop('placeholder', { examples: ['Select Country', 'Select Person'], type: 'string', defaultValue: 'Please select' })
    .prop('minBodyWidth', {
        examples: [
            100, 150, 200, 250, 300, 360, 400,
        ],
        defaultValue: 360,
    })
    .prop('dropdownHeight', {
        examples: [
            100, 200, 300,
        ],
        defaultValue: 300,
    })
    .prop('renderToggler', {
        examples: [
            {
                name: 'Button',
                value: (props) => <Button { ...props } caption={ props.selection.map((s) => s.value.name).join(', ') } />,
            }, {
                name: 'LinkButton',
                value: (props) => <LinkButton { ...props } caption={ props.selection.map((s) => s.value.name).join(', ') } />,
            }, {
                name: 'Search',
                value: (props) => <SearchInput value="" onValueChange={ null } { ...props } />,
            },
        ],
    })
    .prop('getRowOptions', { examples: [{ name: 'Disabled rows', value: () => ({ isDisabled: true, isSelectable: false }) }] })
    .prop('searchPosition', {
        examples: [
            'input', 'body', 'none',
        ],
        defaultValue: 'input',
    })
    .prop('disableClear', { examples: [true], defaultValue: false })
    .prop('renderNotFound', {
        examples: () => [
            {
                name: 'Custom not found block',
                value: () => (
                    <FlexCell grow={ 1 } textAlign="center">
                        <Text>Custom Text or Component</Text>
                    </FlexCell>
                ),
            },
        ],
    })
    .prop('renderRow', {
        examples: (ctx) => [
            {
                name: 'UserPickerRow',
                value: (props, dataSourceState) => (
                    <DataPickerRow
                        { ...props }
                        key={ props.rowKey }
                        alignActions="center"
                        padding={ (ctx.getSelectedProps() as any).editMode === 'modal' ? '24' : '12' }
                        renderItem={ (item, rowProps) => (
                            <PickerItem
                                { ...rowProps }
                                avatarUrl={ item.avatarUrl }
                                title={ item.name }
                                subtitle={ item.jobTitle }
                                dataSourceState={ dataSourceState }
                            />
                        ) }
                    />
                ),
            },
        ],
    })
    .withContexts(DefaultContext, ResizableContext, FormContext, TableContext);

export default PickerInputDoc;
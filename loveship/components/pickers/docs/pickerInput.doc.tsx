import React from 'react';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { PickerInput, PickerInputProps } from '../PickerInput';
import { Button, LinkButton } from '../../buttons';
import { SearchInput, Switch } from '../../inputs';
import { iEditable, sizeDoc, isDisabledDoc, modeDoc } from '../../../docs';
import { DefaultContext, ResizableContext, GridContext, FormContext } from '../../../docs';
import { pickerBaseOptionsDoc } from './common';
import { PickerTogglerProps, PickerInputBaseProps } from '@epam/uui-components';
import {FlexCell, FlexRow} from "../../layout/FlexItems";
import {Text} from "../../typography";

const PickerInputDoc = new DocBuilder<PickerInputBaseProps<any, any> & PickerInputProps>({ name: 'PickerInput', component: PickerInput })
    .implements([sizeDoc, isDisabledDoc, isReadonlyDoc, iEditable, pickerBaseOptionsDoc, modeDoc] as any)
    .prop('value', { examples: [
        { name: '1', value: 1 },
        { name: '[1, 2]', value: [1, 2] },
        { name: '{ id: 1, name: "Test"}', value: { id: 1, name: 'Test' } },
        { name: '[{ id: 1, name: "Test"}]', value: [{ id: 1, name: 'Test' }] },
    ]})
    .prop('valueType', { examples: ['id', 'entity'], isRequired: true })
    .prop('selectionMode', { examples: ['single', 'multi'], isRequired: true })
    .prop('maxItems', { examples: [0, 1, 5, 10, 50, 100, 1000] })
    .prop('minCharsToSearch', { examples: [0, 1, 3, 5] })
    .prop('editMode', { examples: ['dropdown', 'modal'], isRequired: false, defaultValue: 'dropdown' })
    .prop('isInvalid', { examples: [true] })
    .prop('isSingleLine', { examples: [true] })
    .prop('isFoldedByDefault', { examples: [{ value: () => false, name: '(item) => false' }]  })
    .prop('placeholder', { examples: ['Select Country', 'Select Person'], type: 'string', defaultValue: 'Please select' })
    .prop('minBodyWidth', { examples: [100, 150, 200, 250, 300, 350, 400], defaultValue: 350 })
    .prop('dropdownHeight', { examples: [100, 200, 300], defaultValue: 300 })
    .prop('renderToggler', { examples: [
            {
                name: 'Button',
                value: (props: PickerTogglerProps<any, any>) => <Button
                    { ...props }
                    caption={ props.selection.map(s => s.value.name).join(', ') }
                />,
            },
            {
                name: 'LinkButton',
                value: (props: PickerTogglerProps<any, any>) => <LinkButton
                    { ...props }
                    caption={ props.selection.map(s => s.value.name).join(', ') }
                />,
            },
            {
                name: 'Search',
                value: (props: PickerTogglerProps<any, any>) => <SearchInput
                    value=""
                    onValueChange={ null }
                    { ...props }
                />,
            },
        ] })
    .prop('getRowOptions', { examples: [{ name: 'Disabled rows', value: () => ({isDisabled: true}) }] })
    .prop('searchPosition', { examples: ['input' , 'body', 'none'], defaultValue: 'input'})
    .prop('disableClear', { examples: [true], defaultValue: false})
    .prop('renderNotFound', { examples: ctx => [
            {
                name: 'Custom not found block',
                value: (props: any) => <FlexCell grow={ 1 } textAlign='center'><Text>Custom Text or Component</Text></FlexCell>,
            },
        ] })
    .prop('renderFooter', { examples: ctx => [
            {
                name: 'Custom Footer',
                value: (props) => {
                    return (
                        <FlexRow padding='12'>
                            <Switch
                                value={ props.showSelected.value }
                                onValueChange={ props.showSelected.onValueChange }
                                label='Show selected'
                            />
                        </FlexRow>
                    );
                },
            },
        ] })
    .prop('autoFocus', { examples: [true, { value: false, isDefault: true}] })
    .withContexts(DefaultContext, ResizableContext, GridContext, FormContext);

export = PickerInputDoc;

import * as React from 'react';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { PickerInput, PickerInputProps } from '../PickerInput';
import { Button, LinkButton } from '../../buttons';
import { SearchInput } from '../../inputs';
import { iEditable, isDisabledDoc } from '../../../docs';
import { DefaultContext, ResizableContext, GridContext, FormContext } from '../../../docs';
import { pickerBaseOptionsDoc } from './common';
import { PickerTogglerProps, PickerInputBaseProps } from '@epam/uui-components';
import {FlexCell} from "../../layout/FlexItems";
import {Text} from "../../typography";

const PickerInputDoc = new DocBuilder<PickerInputBaseProps<any, any> & PickerInputProps>({ name: 'PickerInput', component: PickerInput })
    .implements([isDisabledDoc, isReadonlyDoc, iEditable, pickerBaseOptionsDoc] as any)
    .prop('size', { examples: ['24', '30', '36', '42'], defaultValue: '36' })
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
    .prop('placeholder', { examples: ['Select Country', 'Select Person'], type: 'string', defaultValue: 'Please select' })
    .prop('minBodyWidth', { examples: [100, 150, 200, 250, 300, 350, 400], defaultValue: 350 })
    .prop('dropdownHeight', { examples: [100, 200, 300], defaultValue: 300 })
    .prop('renderToggler', { examples: [
            {
                name: 'Button',
                value: (props: PickerTogglerProps<any>) => <Button
                    { ...props }
                    caption={ props.selection.map(s => s.value.name).join(', ') }
                />,
            },
            {
                name: 'LinkButton',
                value: (props: PickerTogglerProps<any>) => <LinkButton
                    { ...props }
                    caption={ props.selection.map(s => s.value.name).join(', ') }
                />,
            },
            {
                name: 'Search',
                value: (props: PickerTogglerProps<any>) => <SearchInput
                    value=""
                    onValueChange={ null }
                    { ...props }
                />,
            },
        ] })
    .prop('searchPosition', { examples: ['input' , 'body', 'none'], defaultValue: 'input'})
    .prop('disableClear', { examples: [true], defaultValue: false})
    .prop('renderNotFound', { examples: ctx => [
            {
                name: 'Custom not found block',
                value: (props: any) => <FlexCell grow={ 1 } textAlign='center'><Text>Custom Text or Component</Text></FlexCell>,
            },
        ] })
    .withContexts(DefaultContext, ResizableContext, GridContext, FormContext);

export = PickerInputDoc;

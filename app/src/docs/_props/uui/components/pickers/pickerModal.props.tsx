import * as React from 'react';
import { DocBuilder, isReadonlyDoc } from '@epam/uui-docs';
import { PickerModal, PickerModalProps } from '@epam/uui';
import { Switch } from '@epam/loveship';
import {
    iEditable, sizeDoc, isDisabledDoc, modeDoc, iconDoc, iconOptionsDoc,
} from '../../../loveship/docs';
import {
    DefaultContext, ResizableContext, TableContext, FormContext,
} from '../../../loveship/docs';
import { pickerBaseOptionsDoc } from '../../../loveship/components/pickers/common';
import { FlexCell, FlexRow } from '@epam/loveship';
import { Text } from '@epam/loveship';

const PickerModalDoc = new DocBuilder<PickerModalProps<any, any>>({ name: 'PickerModal', component: PickerModal })
    .implements([
        sizeDoc, isDisabledDoc, isReadonlyDoc, iEditable, pickerBaseOptionsDoc, modeDoc, iconDoc, iconOptionsDoc,
    ])
    .prop('cascadeSelection', {
        examples: [
            true, 'explicit', 'implicit',
        ],
    })
    .prop('valueType', { examples: ['id', 'entity'], isRequired: true })
    .prop('selectionMode', { examples: ['single', 'multi'], isRequired: true })
    .prop('isFoldedByDefault', { examples: [{ value: () => false, name: '(item) => false' }] })
    .prop('getRowOptions', { examples: [{ name: 'Disabled rows', value: () => ({ isDisabled: true }) }] })
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
    .prop('renderFooter', {
        examples: () => [
            {
                name: 'Custom Footer',
                value: (props) => (
                    <FlexRow padding="12">
                        <Switch value={ props.showSelected.value } onValueChange={ props.showSelected.onValueChange } label="Show selected" />
                    </FlexRow>
                ),
            },
        ],
    })
    .withContexts(DefaultContext, ResizableContext, TableContext, FormContext);

export default PickerModalDoc;

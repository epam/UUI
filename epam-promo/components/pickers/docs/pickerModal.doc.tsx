import * as React from 'react';
import { Lens, ArrayDataSource } from '@epam/uui-core';
import { DocBuilder } from '@epam/uui-docs';
import { PickerModal } from '../PickerModal';
import { PickerModalProps } from '@epam/uui-components';
import { ModalContext } from '../../../docs';
import { pickerBaseOptionsDoc } from './common';
import { PickerInput } from '../PickerInput';
import { FlexCell, FlexSpacer } from '../../layout/FlexItems';
import { Button } from '../../buttons';
import { Text } from '../../typography';

const dataSource = new ArrayDataSource({
    items: ["Product Manager", "Technician", "Senior Director", "Software Developer"].map(name => ({ id: name, name })),
});

const PickerInputDoc = new DocBuilder<PickerModalProps<any, any>>({ name: 'PickerModal', component: PickerModal })
    .implements([pickerBaseOptionsDoc /*iconDoc, , */])
    .prop('initialValue', { examples: [
            { name: '1', value: 1 },
            { name: '[1, 2]', value: [1, 2] },
            { name: '{ id: 1, name: "Test"}', value: { id: 1, name: 'Test' } },
            { name: '[{ id: 1, name: "Test"}]', value: [{ id: 1, name: 'Test' }] },
        ] })
    .prop('valueType', { examples: ['id', 'entity'], isRequired: true })
    .prop('selectionMode', { examples: ['single', 'multi'], isRequired: true })
    .prop('caption', { examples: ["The caption is customizable"] })
    .prop('renderFilter', { examples: [
        {
            name: 'Title Filter',
            value: props => (
                <PickerInput
                    { ...Lens.onEditable(props).prop('title').toProps() }
                    valueType='id'
                    selectionMode='single'
                    dataSource={ dataSource }
                    dropdownPlacement='bottom-end'
                />
            ),
        },
    ]})
    .prop('renderFooter', { examples: () => [
        {
            name: 'Custom Footer',
            value: (props: any) => <>
                <Button color='blue' caption='Print' onClick={ () => props.abort() } />
                <FlexSpacer />
                <Button
                    color='green'
                    caption='Give a badge'
                    onClick={ () => {
                        props.success(null);
                        alert("Selection: " + JSON.stringify(props.value));
                    } }
                 />
            </>,
        },
    ]})
    .prop('disallowClickOutside', { examples: [true], defaultValue: false})
    .prop('renderNotFound', { examples: () => [
        {
            name: 'Custom not found block',
            value: props => <FlexCell grow={ 1 } textAlign='center'><Text>Custom Text or Component</Text></FlexCell>,
        },
    ] })
    .withContexts(ModalContext);

export default PickerInputDoc;

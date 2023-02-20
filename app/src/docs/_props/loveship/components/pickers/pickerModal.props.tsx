import * as React from 'react';
import { ArrayDataSource } from '@epam/uui-core';
import { DocBuilder } from '@epam/uui-docs';
import { PickerModalProps } from '@epam/uui-components';
import { PickerModal } from '@epam/loveship';
import { ModalContext } from '../../docs';
import { pickerBaseOptionsDoc } from './common';
import { PickerInput } from '@epam/loveship';
import { FlexCell, FlexSpacer } from '@epam/loveship';
import { Button } from '@epam/loveship';
import { Text } from '@epam/loveship';

const dataSource = new ArrayDataSource({
    items: ['Product Manager', 'Technician', 'Senior Director', 'Software Developer'].map(name => ({ id: name, name })),
});

const PickerInputDoc = new DocBuilder<PickerModalProps<any, any>>({ name: 'PickerModal', component: PickerModal })
    .implements([pickerBaseOptionsDoc /*iconDoc, , */])
    .prop('valueType', { examples: ['id', 'entity'], isRequired: true })
    .prop('selectionMode', { examples: ['single', 'multi'], isRequired: true })
    .prop('caption', { examples: ['The caption is customizable'] })
    .prop('renderFilter', {
        examples: [
            {
                name: 'Title Filter',
                value: props => (
                    <PickerInput {...props} valueType="id" selectionMode="single" dataSource={dataSource} dropdownPlacement="bottom-end" />
                ),
            },
        ],
    })
    .prop('renderFooter', {
        examples: () => [
            {
                name: 'Custom Footer',
                value: (props: any) => (
                    <>
                        <Button color="night200" caption="Print" onClick={() => props.abort()} />
                        <FlexSpacer />
                        <Button
                            color="grass"
                            caption="Give a badge"
                            onClick={() => {
                                props.success(null);
                                alert('Selection: ' + JSON.stringify(props.value));
                            }}
                        />
                    </>
                ),
            },
        ],
    })
    .prop('disallowClickOutside', { examples: [true], defaultValue: false })
    .prop('renderNotFound', {
        examples: () => [
            {
                name: 'Custom not found block',
                value: () => (
                    <FlexCell grow={1} textAlign="center">
                        <Text>Custom Text or Component</Text>
                    </FlexCell>
                ),
            },
        ],
    })
    .withContexts(ModalContext);

export default PickerInputDoc;

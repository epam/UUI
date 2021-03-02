import React from 'react';
import { IEditable, ArrayDataSource } from '@epam/uui';
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

const PickerInputDoc = new DocBuilder<PickerModalProps<any, any>>({ name: 'PickerModal', component: PickerModal as React.ComponentClass<any> })
    .implements([pickerBaseOptionsDoc /*iconDoc, , */] as any)
    .prop('valueType', { examples: ['id', 'entity'], isRequired: true })
    .prop('selectionMode', { examples: ['single', 'multi'], isRequired: true })
    .prop('caption', { examples: ["The caption is customizable"] })
    .prop('renderFilter', { examples: [
        { name: 'Title Filter', value: (props: IEditable<any>) => {
            return <PickerInput
                { ...props }
                valueType='id'
                selectionMode='single'
                dataSource={ dataSource }
                dropdownPlacement='bottom-end'
            />;
        }},
    ]})
    .prop('renderFooter', { examples: ctx => [
        {
            name: 'Custom Footer',
            value: (props: any) => <>
                <Button color='night200' caption='Print' onClick={ () => props.abort() } />
                <FlexSpacer />
                <Button
                    color='grass'
                    caption='Give a badge'
                    onClick={ () => {
                        props.success(null);
                        alert("Selection: " + JSON.stringify(props.value));
                    } }
                 />
            </>,
        },
    ]})
    .prop('renderNotFound', { examples: ctx => [
        {
            name: 'Custom not found block',
            value: (props: any) => <FlexCell grow={ 1 } textAlign='center'><Text>Custom Text or Component</Text></FlexCell>,
        },
    ] })
    .withContexts(ModalContext);

export = PickerInputDoc;
import * as React from 'react';
import { PickerListBaseProps } from '@epam/uui-components';
import { DocBuilder } from '@epam/uui-docs';
import { PickerList } from '@epam/loveship';
import { PickerListProps } from '@epam/uui';
import { iEditable, isDisabledDoc } from '../../docs';
import { DefaultContext, ResizableContext, FormContext } from '../../docs';
import { pickerBaseOptionsDoc } from './common';
import { LinkButton, Button } from '@epam/loveship';
import { Text } from '@epam/loveship';
import { FlexRow } from '@epam/loveship';

const PickerListDoc = new DocBuilder<PickerListProps<any, any> & PickerListBaseProps<any, any>>({ name: 'PickerList', component: PickerList })
    .implements([
        /* sizeDoc, */ isDisabledDoc, iEditable, pickerBaseOptionsDoc,
    ])
    .prop('value', {
        examples: [
            { name: '1', value: 1 }, { name: '[1, 2]', value: [1, 2] }, { name: '{ id: 1, name: "Test"}', value: { id: 1, name: 'Test' } }, { name: '[{ id: 1, name: "Test"}]', value: [{ id: 1, name: 'Test' }] },
        ],
    })
    .prop('valueType', { examples: ['id', 'entity'], isRequired: true })
    .prop('selectionMode', { examples: ['single', 'multi'], isRequired: true })
    .prop('defaultIds', {
        examples: [
            { value: ['en', 'ru'], name: 'Languages' }, {
                value: [
                    '500096', '625144', '2759794',
                ],
                name: 'Locations',
            }, {
                value: [
                    1, 2, 3, 4,
                ],
                name: 'Language Levels',
            },
        ],
    })
    .prop('settingsKey', { examples: ['demoPickerList'] })
    .prop('maxDefaultItems', {
        examples: [
            2, 5, 10, 20,
        ],
        defaultValue: 10,
    })
    .prop('maxTotalItems', {
        examples: [
            10, 20, 50, 1000,
        ],
        defaultValue: 50,
    })
    .prop('placeholder', { examples: ['Select Country', 'Select Person'], type: 'string', defaultValue: 'Please select' })
    .prop('renderModalToggler', {
        examples: [
            {
                name: 'Custom Button',
                value: (props) => <LinkButton { ...props } caption="Custom Button" />,
            },
        ],
    })
    .prop('disallowClickOutside', { examples: [true], defaultValue: false })
    .prop('noOptionsMessage', {
        examples: [
            {
                value: (
                    <FlexRow spacing="12">
                        <Text>No results found</Text>
                        <Button onClick={ () => {} } size="24" caption="Search" />
                    </FlexRow>
                ),
                name: '<Text/><Button/>',
            },
        ],
    })
    .withContexts(DefaultContext, ResizableContext, FormContext);

export default PickerListDoc;

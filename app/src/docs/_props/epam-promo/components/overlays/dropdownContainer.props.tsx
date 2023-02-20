import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext } from '../../docs';
import { DropdownContainer, Text } from '@epam/promo';

const dropdownContainerDoc = new DocBuilder({
    name: 'DropdownContainer',
    component: DropdownContainer,
})
    .prop('vPadding', {
        examples: ['6', '12', '18', '24', '30', '48'],
    })
    .prop('padding', {
        examples: ['6', '12', '18', '24', '30'],
    })
    .prop('color', {
        examples: ['white', { name: 'gray70', value: 'gray70' }],
    })
    .prop('children', {
        examples: [{ value: <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, pariatur!</Text>, name: 'Basic' }],
        isRequired: true,
    })
    .withContexts(DefaultContext);

export default dropdownContainerDoc;

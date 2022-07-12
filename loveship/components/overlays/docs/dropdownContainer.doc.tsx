import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext } from '../../../docs';
import { DropdownContainer } from "../../../components";

const dropdownContainerDoc = new DocBuilder({
    name: 'DropdownContainer',
    component: DropdownContainer,
})
    .prop('showArrow', {
        examples: [{ value: true }], description: 'Render arrow only inside Dropdown components',
    })
    .prop('vPadding', {
        examples: ['6', '12', '18', '24', '30', '48'],
    })
    .prop('padding', {
        examples: ['6', '12', '18', '24', '30'],
    })
    .prop('color', {
        examples: ['white', { name: 'night700', value: 'night700' }],
    })
    .prop('children', {
        examples: [{ value: <div style={ { width: '50%' } }>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, pariatur!</div>, name: 'Basic' }],
        isRequired: true,
    }).withContexts(DefaultContext);

export = dropdownContainerDoc;
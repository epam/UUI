import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext } from '../../docs';
import { DropdownContainer, Text } from '@epam/loveship';

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
        examples: ['white', { name: 'night700', value: 'night700' }],
    })
    .prop('children', {
        examples: (ctx) => {
            const color = ctx.getSelectedProps().color;
            const textContent = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, pariatur!';

            return [
                {
                    value: color === 'white' || !color ? <Text color="night700">{textContent}</Text> : <Text color="night50">{textContent}</Text>,
                    name: 'Basic',
                },
            ];
        },
        isRequired: true,
    })
    .withContexts(DefaultContext);

export default dropdownContainerDoc;

import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext } from '../../docs';
import { DropdownContainer, Text, Button } from '@epam/promo';

const dropdownContainerDoc = new DocBuilder({
    name: 'DropdownContainer',
    component: DropdownContainer,
})
    .prop('vPadding', {
        examples: [
            '6', '12', '18', '24', '30', '48',
        ],
    })
    .prop('padding', {
        examples: [
            '6', '12', '18', '24', '30',
        ],
    })
    .prop('color', {
        examples: ['white', { name: 'gray70', value: 'gray70' }],
    })
    .prop('children', {
        examples: (ctx) => {
            const color = ctx.getSelectedProps().color;
            const textContent = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, pariatur!';

            return [
                {
                    value: (
                        <div>
                            {color === 'white' || !color ? <Text color="gray80">{textContent}</Text> : <Text color="gray5">{textContent}</Text>}
                            <Button caption="Click first" href="/" rawProps={ { style: { margin: '6px' } } } />
                            <Button caption="Click second" href="/" rawProps={ { style: { margin: '6px' } } } />
                        </div>
                    ),
                    name: 'Basic',
                },
            ];
        },
        isRequired: true,
    })
    .prop('focusLock', {
        examples: [{ value: false, isDefault: true }, true],
    })
    .withContexts(DefaultContext);

export default dropdownContainerDoc;

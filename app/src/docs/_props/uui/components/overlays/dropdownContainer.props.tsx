import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext } from '../../docs';
import { DropdownContainer, Text, Button, FlexRow } from '@epam/uui';

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
    .prop('children', {
        examples: () => {
            const textContent = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, pariatur!';

            return [
                {
                    value: (
                        <div>
                            <Text color="secondary">{textContent}</Text>
                            <FlexRow spacing="12">
                                <Button caption="Primary Action" onClick={ () => {} } />
                                <Button caption="Secondary Action" color="secondary" onClick={ () => {} } />
                            </FlexRow>
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

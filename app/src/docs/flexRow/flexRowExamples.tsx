import React from 'react';
import { Text, TextInput, FlexCell, Button } from '@epam/uui';

export const flexRowChildren = [
    {
        name: 'Text 24',
        value: (
            <Text size="24">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pharetra vitae felis in malesuada.
            </Text>
        ),
        isDefault: true,
    }, {
        name: 'Text, TextInput, Button',
        value: (
            <React.Fragment>
                <FlexCell grow={ 1 }>
                    <Text>Name:</Text>
                </FlexCell>
                <FlexCell grow={ 1 }>
                    <TextInput value="Rebecca" onValueChange={ null } />
                </FlexCell>
                <FlexCell grow={ 1 }>
                    <Button fill="solid" caption="Submit" />
                </FlexCell>
            </React.Fragment>
        ),
    },
];

import { TSkin } from '../../common';
import React from 'react';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as uui from '@epam/uui';

const COMPONENTS_BY_SKIN = {
    [TSkin.UUI3_loveship]: {
        Text: loveship.Text,
        TextInput: loveship.TextInput,
        FlexCell: loveship.FlexCell,
        Button: loveship.Button,
    },
    [TSkin.UUI4_promo]: {
        Text: promo.Text,
        TextInput: promo.TextInput,
        FlexCell: promo.FlexCell,
        Button: promo.Button,
    },
    [TSkin.UUI]: {
        Text: uui.Text,
        TextInput: uui.TextInput,
        FlexCell: uui.FlexCell,
        Button: uui.Button,
    },
};

export const getFlexRowExamples = (skin: TSkin) => {
    const { Text, TextInput, FlexCell, Button } = COMPONENTS_BY_SKIN[skin];
    return {
        children: [
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
        ],
    };
};

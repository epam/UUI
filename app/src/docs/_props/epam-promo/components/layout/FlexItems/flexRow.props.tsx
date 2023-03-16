import * as React from 'react';
import { FlexRow, RowMods, Button, Text, TextInput, FlexCell } from '@epam/promo';
import { FlexRowProps } from '@epam/uui-core';
import { DocBuilder } from '@epam/uui-docs';
import { DefaultContext, onClickDoc } from '../../../docs';

const flexRowDoc = new DocBuilder<FlexRowProps & RowMods>({ name: 'FlexRow', component: FlexRow })
    .implements([onClickDoc])
    .prop('children', { examples: [
            {
                name: 'Text 24',
                value:
                    <React.Fragment>
                        <Text size='24'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pharetra vitae felis in malesuada.</Text>
                    </React.Fragment>,
                isDefault: true,
            },
            {
                name: 'Text, TextInput, Button',
                value:
                    <React.Fragment>
                        <FlexCell grow={ 1 }>
                            <Text>Name:</Text>
                        </FlexCell>
                        <FlexCell grow={ 1 }>
                            <TextInput value='Rebecca' onValueChange={ null }/>
                        </FlexCell>
                        <FlexCell grow={ 1 }>
                            <Button color='green' caption='Submit'/>
                        </FlexCell>
                    </React.Fragment>,
                isDefault: true,
            },
        ] })
    .prop('size', { examples: ['24', '30', '36', '42', '48'], defaultValue: '36' })
    .prop('topShadow', { examples: [true] })
    .prop('borderBottom', { examples: [true, false] })
    .prop('margin', { examples: ['12', '24'] })
    .prop('background', { examples: ['white', 'gray5', 'none'], defaultValue: 'none' })
    .prop('padding', { examples: ['12', '18', '24'] })
    .prop('vPadding', { examples: ['12', '24'] })
    .prop('spacing', { examples: ['6', '12', '18'] })
    .prop('alignItems', { examples: ['top', 'center'] })
    .withContexts(DefaultContext);

export default flexRowDoc;

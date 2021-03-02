import React from 'react';
import { FlexRow, RowMods, Button, Text, LabeledInput, ControlWrapper, CheckboxGroup, TextInput, FlexCell } from '../../../../components';
import { FlexRowProps } from '@epam/uui';
import { DocBuilder } from '@epam/uui-docs';
import { ResizableContext, DefaultContext, onClickDoc } from '../../../../docs';

const flexRowDoc = new DocBuilder<FlexRowProps & RowMods>({ name: 'FlexRow', component: FlexRow })
    .implements([onClickDoc] as any)
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
                            <Button color='grass' caption='Submit'/>
                        </FlexCell>
                    </React.Fragment>,
                isDefault: true,
            },
            {
                name: 'Text, Button, CheckboxGroup',
                value:
                    <React.Fragment>
                        <FlexCell grow={ 1 }>
                            <LabeledInput size='36' label='Name'>
                                <Text>Rebecca</Text>
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell grow={ 1 }>
                            <LabeledInput size='36' label='Help'>
                                <Button caption='Help'/>
                            </LabeledInput>
                        </FlexCell>
                        <FlexCell grow={ 1 }>
                            <LabeledInput size='36' label='Checkbox group'>
                                <ControlWrapper size='36'>
                                    <CheckboxGroup
                                        onValueChange={ null }
                                        items={ [
                                            { name: 'Calamari Cruiser', id: 1 },
                                            { name: 'Scimitar', id: 2 },
                                            { name: 'Droid control ship', id: 3 },
                                            { name: 'T-70 X-wing fighter', id: 4 },
                                        ] }
                                        value={ [1] }
                                    />
                                </ControlWrapper>
                            </LabeledInput>
                        </FlexCell>
                    </React.Fragment>,
                isDefault: true,
            },
        ] })
    .prop('size', { examples: ['24', '36', '48'], defaultValue: '36' })
    .prop('topShadow', { examples: [true] })
    .prop('borderBottom', { examples: [true, 'night50', 'night400'] })
    .prop('margin', { examples: ['12', '24'] })
    .prop('background', { examples: ['white', 'night50', 'none'], defaultValue: 'none' })
    .prop('padding', { examples: ['12', '18', '24'] })
    .prop('vPadding', { examples: ['12', '24'] })
    .prop('spacing', { examples: ['6', '18'] })
    .prop('alignItems', { examples: ['top', 'center'] })
    .prop('type', { examples:['form', 'panel'], defaultValue: 'panel' })
    .withContexts(DefaultContext, ResizableContext);

export = flexRowDoc;

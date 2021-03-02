import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { CarouselProps } from '@epam/uui-components';
import { CarouselMods, Carousel } from '../Carousel';
import { colorDoc, DefaultContext, ResizableContext } from '../../../docs';
import { FlexRow, Text, FlexCell, Panel } from '../../../components';

const renderItem = (item: any) => {
    return (
        <Panel style={ { width: 200 } } margin='24' background='white'>
            <FlexRow padding='12'>
                <Text font='sans'>GRID</Text>
            </FlexRow>
            <FlexRow padding='12' background='night50'>
                <FlexCell width={ 150 } minWidth={ 150 } grow={ 4 }>
                    <Text size='24'>{ item.country }</Text>
                </FlexCell>
            </FlexRow>
            <FlexRow padding='12' size='36' borderBottom>
                <FlexCell grow={ 1 }><Text size='24'>Republic Cruiser</Text></FlexCell>
            </FlexRow>
            <FlexRow padding='12' size='36' borderBottom>
                <FlexCell grow={ 1 }><Text size='24'>Calamari Cruiser</Text></FlexCell>
            </FlexRow>
            <FlexRow padding='12' size='36' borderBottom>
                <FlexCell grow={ 1 }><Text size='24'>Naboo Royal Starship</Text></FlexCell>
            </FlexRow>
        </Panel>);
};

const items = [
    { country: 'Belarus' },
    { country: 'Russia' },
    { country: 'China' },
    { country: 'USA' },
    { country: 'Japan' },
    { country: 'Poland' },
    { country: 'Italy' },
];

const textDoc = new DocBuilder<CarouselProps & CarouselMods>({ name: 'Carousel', component: Carousel as React.ComponentClass<any> })
    .implements([colorDoc] as any)
    .prop('items', {
        examples: [
            {
                value: items,
                name: 'items',
                isDefault: true,
            },
        ],
        defaultValue: [],
    })
    .prop('renderItem', {
        examples: [
            {
                value: renderItem,
                name: 'renderItem',
                isDefault: true,
            },
        ], isRequired: true,
    })
    .prop('divideBy', {
        examples: [
            2,
            {
                value: 3,
                isDefault: true,
            },
        ], defaultValue: 3,
    })
    .withContexts(ResizableContext, DefaultContext);

export = textDoc;

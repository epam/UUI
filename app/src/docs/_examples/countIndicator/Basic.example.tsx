import React from 'react';
import { CountIndicatorProps, CountIndicator, Text } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

const exampleNames = ['Neutral', 'White', 'Info', 'Success', 'Warning', 'Negative'];
const captions = ['0', '1', '5', '+99', '123', '2'];
const colors: CountIndicatorProps['color'][] = ['neutral', 'white', 'info', 'success', 'warning', 'critical'];

export default function BasicCountIndicatorExample(props: ExampleProps) {
    const sizes = getAllPropValues('size', false, props) as Array<CountIndicatorProps['size']>;
    const solidExamples: CountIndicatorProps[] = sizes?.flatMap((size) =>
        captions.map((caption, index) => ({
            caption,
            color: colors[index],
            size,
        })));

    return (
        <div style={ { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '18px 12px', justifyItems: 'center' } }>
            { exampleNames.map((name) => <Text size="none" fontWeight="600">{ name }</Text>)}
            { solidExamples?.map((item, index) => <CountIndicator key={ index } caption={ item.caption } color={ item.color } size={ item.size } />) }
        </div>
    );
}

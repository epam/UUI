import React from 'react';
import { CountIndicatorProps, CountIndicator, Text } from '@epam/uui';

const exampleNames = ['Neutral', 'White', 'Info', 'Success', 'Warning', 'Negative'];

const solidExamples: CountIndicatorProps[] = [
    { caption: 'Size 12', color: 'neutral', size: '12' },
    { caption: '1', color: 'white', size: '12' },
    { caption: '5', color: 'info', size: '12' },
    { caption: '', color: 'success', size: '12' },
    { caption: '123', color: 'warning', size: '12' },
    { caption: 'is inactive', color: 'critical', size: '12' },
    { caption: 'Size 18', color: 'neutral', size: '18' },
    { caption: '1', color: 'white', size: '18' },
    { caption: '5', color: 'info', size: '18' },
    { caption: '', color: 'success', size: '18' },
    { caption: '123', color: 'warning', size: '18' },
    { caption: 'is inactive', color: 'critical', size: '18' },
    { caption: 'Size 24', color: 'neutral', size: '24' },
    { caption: '1', color: 'white', size: '24' },
    { caption: '5', color: 'info', size: '24' },
    { caption: '', color: 'success', size: '24' },
    { caption: '123', color: 'warning', size: '24' },
    { caption: 'is inactive', color: 'critical', size: '24' },
];

export default function BasicCountIndicatorExample() {
    const getCountIndicator = (item: CountIndicatorProps) => {
        if (item.color === 'white') {
            return (
                <div style={ { backgroundColor: '#1D1E26', display: 'flex', justifyItems: 'center' } }>
                    <CountIndicator caption={ item.caption } color={ item.color } size={ item.size } />
                </div>
            );
        }
        return <CountIndicator caption={ item.caption } color={ item.color } size={ item.size } />;
    };

    return (
        <div style={ { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: '1fr 2fr 2fr 2fr', gap: '6px', textAlign: 'center' } }>
            { exampleNames.map((name) => <Text font="semibold">{ name }</Text>)}
            { solidExamples.map((example) => (
                <>
                    { getCountIndicator(example) }
                </>
            )) }
        </div>

    );
}

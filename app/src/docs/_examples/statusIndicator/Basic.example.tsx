import React from 'react';
import { StatusIndicatorProps, StatusIndicator, Text } from '@epam/uui';

const uuiIndicators: StatusIndicatorProps[] = [
    { color: 'neutral' },
    { color: 'info' },
    { color: 'success' },
    { color: 'warning' },
    { color: 'critical' },
];

export default function BasicStatusIndicatorExample() {
    return (
        <div style={ {
            display: 'grid',
            gridTemplateColumns: '80px repeat(5, minmax(50px, max-content))',
            gap: '12px',
            justifyItems: 'center',
            alignItems: 'center',
        } }
        >
            <Text>Fill / Color</Text>
            {uuiIndicators.map((item) => <Text key={ item.color }>{ item.color.split('')[0].toUpperCase() + item.color.slice(1) }</Text>)}
            <Text rawProps={ { style: { padding: '0' } } }>Contrast</Text>
            { uuiIndicators.map((item) => <StatusIndicator key={ item.color } color={ item.color } />) }
            <Text rawProps={ { style: { padding: '0' } } }>Bright</Text>
            { uuiIndicators.map((item) => <StatusIndicator key={ item.color } color={ item.color } fill="bright" />) }
            <Text rawProps={ { style: { padding: '0' } } }>Outline</Text>
            { uuiIndicators.map((item) => <StatusIndicator key={ item.color } color={ item.color } fill="outline" />) }
        </div>

    );
}

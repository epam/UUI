import React from 'react';
import { StatusIndicatorProps, StatusIndicator, Text, FlexRow, TextColor } from '@epam/uui';

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
            gridTemplateColumns: '80px repeat(5, min-content)',
            gap: '12px',
            justifyItems: 'left',
            alignItems: 'center',
        } }
        >
            <Text rawProps={ { style: { padding: '0' } } }>Fill solid:</Text>
            { uuiIndicators.map((item) => (
                <FlexRow spacing="6">
                    <StatusIndicator key={ item.color } color={ item.color } />
                    <Text key={ item.color } color={ item.color === 'neutral' ? 'brand' : item.color as TextColor }>
                        { item.color.split('')[0].toUpperCase() + item.color.slice(1) }
                    </Text>
                </FlexRow>
            )) }
            <Text rawProps={ { style: { padding: '0' } } }>Fill outline:</Text>
            { uuiIndicators.map((item) => (
                <FlexRow spacing="6">
                    <StatusIndicator key={ item.color } color={ item.color } fill="outline" />
                    <Text key={ item.color } color={ item.color === 'neutral' ? 'brand' : item.color as TextColor }>
                        { item.color.split('')[0].toUpperCase() + item.color.slice(1) }
                    </Text>
                </FlexRow>
            )) }
        </div>

    );
}

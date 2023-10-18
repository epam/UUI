import React from 'react';
import { StatusIndicatorProps, StatusIndicator, Text } from '@epam/uui';

const uuiIndicators: StatusIndicatorProps[] = [
    { color: 'neutral', caption: 'Neutral' },
    { color: 'info', caption: 'Info' },
    { color: 'success', caption: 'Success' },
    { color: 'warning', caption: 'Warning' },
    { color: 'critical', caption: 'Critical' },
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
                <StatusIndicator caption={ item.caption } key={ item.color } color={ item.color } />
            )) }
            <Text rawProps={ { style: { padding: '0' } } }>Fill outline:</Text>
            { uuiIndicators.map((item) => (
                <StatusIndicator caption={ item.caption } key={ item.color } color={ item.color } fill="outline" />
            )) }
        </div>

    );
}

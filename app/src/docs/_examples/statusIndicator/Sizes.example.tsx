import React from 'react';
import { StatusIndicator, Text } from '@epam/uui';

export default function SizesStatusIndicatorExample() {
    return (
        <div style={ {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 70px)',
            gap: '12px',
            justifyItems: 'center',
        } }
        >
            <Text>size 24</Text>
            <Text>size 18</Text>
            <Text>size 12</Text>
            <StatusIndicator color="info" />
            <StatusIndicator color="info" size="18" />
            <StatusIndicator color="info" size="12" />
        </div>
    );
}

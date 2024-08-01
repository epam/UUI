import React from 'react';
import { Panel, Text, Badge } from '@epam/uui';

export default function ColorsExample() {
    return (
        
        <Panel style={ { padding: '12px', flex: '1 1 0' } }>
            <Text fontSize="14">Semantic colors, use for appropriate sense</Text>
            <div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
                <Badge color="info" fill="solid" caption="Info" />
                <Badge color="success" fill="solid" caption="Success" />
                <Badge color="critical" fill="solid" caption="Critical" />
                <Badge color="warning" fill="solid" caption="Warning" />
                <Badge color="neutral" fill="solid" caption="Neutral" />
            </div>
        </Panel>
    );
}

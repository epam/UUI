import React from 'react';
import { Badge, FlexRow, Panel, Text } from '@epam/uui';

export default function StylesExample() {
    return (
        <FlexRow rawProps={ { style: { width: '100%' } } }>
            <Panel style={ { rowGap: '18px', marginRight: '12px', padding: '12px', flex: '0 1 auto' } }>
                <Badge color="info" fill="solid" caption="Solid" />
                <Badge color="info" fill="outline" caption="Halftone" />
            </Panel>
            <Panel style={ { rowGap: '18px', padding: '12px', flex: '1 1 auto' } }>
                <Text fontSize="14">Mostly used as an accent, primary information or feature </Text>
                <Text fontSize="14">Mostly used as secondary information or feature </Text>
            </Panel>
        </FlexRow>
    );
}

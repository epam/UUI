import React from 'react';
import { FlexRow, Badge, Panel, Text } from '@epam/promo';

export default function StylesExample() {
    return (
        <FlexRow>
            <Panel style={{ rowGap: '18px', marginRight: '12px' }}>
                <Badge color="blue" fill="solid" caption="Solid" />
                <Badge color="blue" fill="semitransparent" caption="Halftone" />
            </Panel>
            <Panel style={{ rowGap: '18px' }}>
                <Text fontSize="14">Mostly used as an accent, primary information or feature </Text>
                <Text fontSize="14">Mostly used as secondary information or feature </Text>
            </Panel>
        </FlexRow>
    );
}

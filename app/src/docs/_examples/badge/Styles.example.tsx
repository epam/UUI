import React from 'react';
import { FlexRow, Panel, Text } from '@epam/uui';
import { Badge } from '@epam/promo';

export default function StylesExample() {
    return (
        <FlexRow>
            <Panel style={ { rowGap: '18px', marginRight: '12px', padding: '12px' } }>
                <Badge color="blue" fill="solid" caption="Solid" />
                <Badge color="blue" fill="semitransparent" caption="Halftone" />
            </Panel>
            <Panel style={ { rowGap: '18px', padding: '12px' } }>
                <Text fontSize="14">Mostly used as an accent, primary information or feature </Text>
                <Text fontSize="14">Mostly used as secondary information or feature </Text>
            </Panel>
        </FlexRow>
    );
}

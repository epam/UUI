import React from 'react';
import { Badge, FlexRow, Text } from '@epam/uui';

export default function StylesExample() {
    return (
        <div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
            <FlexRow columnGap={ 12 } rawProps={ { style: { flexWrap: 'wrap', flex: '0 1 auto' } } }>
                <Badge color="info" fill="solid" caption="Solid" />
                <Text fontSize="14">Mostly used as an accent, primary information or feature </Text>
            </FlexRow>
            <FlexRow columnGap={ 12 } rawProps={ { style: { flexWrap: 'wrap', flex: '0 1 auto' } } }>
                <Badge color="info" fill="outline" caption="Halftone" />
                <Text fontSize="14">Mostly used as secondary information or feature </Text>
            </FlexRow>
        </div>
    );
}

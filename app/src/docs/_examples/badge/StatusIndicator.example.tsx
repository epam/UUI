import React from 'react';
import { FlexRow, Badge } from '@epam/uui';

export default function StatusIndicatorExample() {
    return (
        <FlexRow alignItems="center" columnGap="18" rowGap="18" rawProps={ { style: { flexWrap: 'wrap', flexShrink: '1' } } }>
            <Badge color="success" fill="outline" indicator={ true } caption="Ready" />
            <Badge color="warning" fill="outline" indicator={ true } caption="In Progress" />
            <Badge color="neutral" fill="outline" indicator={ true } caption="Draft" />
        </FlexRow>
    );
}

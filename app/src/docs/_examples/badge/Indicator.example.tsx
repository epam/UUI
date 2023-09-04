import React from 'react';
import { FlexRow, Badge } from '@epam/uui';

export default function IndicatorExample() {
    return (
        <FlexRow alignItems="center" spacing="18">
            <Badge color="success" fill="transparent" caption="Ready" />
            <Badge color="warning" fill="transparent" caption="In Progress" />
            <Badge color="neutral" fill="transparent" caption="Draft" />
        </FlexRow>
    );
}

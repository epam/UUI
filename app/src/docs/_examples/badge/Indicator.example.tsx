import React from 'react';
import { Badge, FlexRow } from '@epam/promo';

export default function IndicatorExample() {
    return (
        <FlexRow alignItems="center" spacing="18">
            <Badge color="green" fill="transparent" caption="Ready" />
            <Badge color="orange" fill="transparent" caption="In Progress" />
            <Badge color="gray30" fill="transparent" caption="Draft" />
        </FlexRow>
    );
}

import React from 'react';
import { FlexRow, Badge } from '@epam/uui';

export default function StatusIndicatorExample() {
    return (
        <FlexRow alignItems="center" spacing="18">
            <Badge color="success" fill="outline" indicator={ true } caption="Ready" />
            <Badge color="warning" fill="outline" indicator={ true } caption="In Progress" />
            <Badge color="neutral" fill="outline" indicator={ true } caption="Draft" />
        </FlexRow>
    );
}

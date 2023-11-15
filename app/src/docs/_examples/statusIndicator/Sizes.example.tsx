import React from 'react';
import { FlexRow, StatusIndicator } from '@epam/uui';

export default function SizesStatusIndicatorExample() {
    return (
        <FlexRow spacing="18">
            <StatusIndicator color="info" caption="Size 24" />
            <StatusIndicator color="info" size="18" caption="Size 18" />
            <StatusIndicator color="info" size="12" caption="Size 12" />
        </FlexRow>
    );
}

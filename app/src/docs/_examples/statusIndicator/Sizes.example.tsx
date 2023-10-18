import React from 'react';
import { FlexRow, StatusIndicator, Text } from '@epam/uui';

export default function SizesStatusIndicatorExample() {
    return (
        <FlexRow spacing="18">
            <FlexRow spacing="6">
                <StatusIndicator color="info" />
                <Text>size 24</Text>
            </FlexRow>
            <FlexRow spacing="6">
                <StatusIndicator color="info" size="18" />
                <Text>size 18</Text>
            </FlexRow>
            <FlexRow spacing="6">
                <StatusIndicator color="info" size="12" />
                <Text>size 12</Text>
            </FlexRow>
        </FlexRow>
    );
}

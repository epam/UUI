import React from 'react';
import { StatusIndicatorProps, StatusIndicator, Text, FlexRow, FlexCell } from '@epam/uui';

const uuiIndicators: StatusIndicatorProps[] = [
    { color: 'neutral', caption: 'Neutral' },
    { color: 'info', caption: 'Info' },
    { color: 'success', caption: 'Success' },
    { color: 'warning', caption: 'Warning' },
    { color: 'critical', caption: 'Critical' },
];

export default function BasicStatusIndicatorExample() {
    return (
        <>
            <FlexCell width={ 80 }>
                <FlexRow>
                    <Text>Fill solid:</Text>
                </FlexRow>
                <FlexRow>
                    <Text>Fill outline:</Text>
                </FlexRow>
            </FlexCell>
            <FlexCell width="auto">
                <FlexRow columnGap="12" alignItems="center">
                    { uuiIndicators.map((item) => <StatusIndicator caption={ item.caption } key={ item.color } color={ item.color } />) }
                </FlexRow>
                <FlexRow columnGap="12" alignItems="center">
                    { uuiIndicators.map((item) => <StatusIndicator caption={ item.caption } key={ item.color } color={ item.color } fill="outline" />) }
                </FlexRow>
            </FlexCell>
        </>
    );
}

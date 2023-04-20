import React from 'react';
import { FlexCell, FlexRow, Panel, Text } from '@epam/promo';
import { demoData } from '@epam/uui-docs';

export default function BasicExample() {
    return (
        <Panel margin="24" style={{ width: '400px' }} shadow background="white">
            <FlexRow padding="12" vPadding="12" borderBottom>
                <FlexCell width="100%">
                    <Text size="36" font="sans" color="gray60">
                        {demoData.loremIpsum}
                    </Text>
                </FlexCell>
            </FlexRow>
        </Panel>
    );
}

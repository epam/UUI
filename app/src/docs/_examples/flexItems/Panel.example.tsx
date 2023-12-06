import React from 'react';
import { FlexCell, FlexRow, Panel, Text } from '@epam/uui';
import { demoData } from '@epam/uui-docs';

export default function BasicExample() {
    return (
        <Panel background="surface-main" margin="24" style={ { width: '400px' } } shadow>
            <FlexRow padding="12" vPadding="12" borderBottom>
                <FlexCell width="100%">
                    <Text size="36" color="secondary">
                        {demoData.loremIpsum}
                    </Text>
                </FlexCell>
            </FlexRow>
        </Panel>
    );
}

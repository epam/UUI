import React from 'react';
import { FlexRow, Panel, Text } from '@epam/uui';
import { Badge } from '@epam/promo';

export default function ColorsExample() {
    return (
        <>
            <Panel style={ { rowGap: '18px', marginRight: '42px', padding: '12px' } }>
                <Text fontSize="14">Semantic colors, use for appropriate sense</Text>
                <FlexRow spacing="12">
                    <Badge color="blue" fill="solid" caption="Info" />
                    <Badge color="green" fill="solid" caption="Success" />
                    <Badge color="red" fill="solid" caption="Error" />
                    <Badge color="gray30" fill="solid" caption="Default" />
                    <Badge color="amber" fill="solid" caption="Warning" />
                </FlexRow>
            </Panel>
            <Panel style={ { rowGap: '18px', padding: '12px' } }>
                <Text fontSize="14">Additional colors, use for extra cases, when semantic does not enough</Text>
                <FlexRow spacing="12">
                    <Badge color="orange" fill="solid" caption="Orange" />
                    <Badge color="violet" fill="solid" caption="Violet" />
                    <Badge color="cyan" fill="solid" caption="Cyan" />
                    <Badge color="purple" fill="solid" caption="Purple" />
                </FlexRow>
            </Panel>
        </>
    );
}

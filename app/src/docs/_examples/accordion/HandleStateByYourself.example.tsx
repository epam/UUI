import React, { useState } from 'react';
import { Accordion, FlexCell, Text } from '@epam/promo';
import { demoData } from '@epam/uui-docs';

export default function HandleStateByYourselfExample() {
    const [value, onValueChange] = useState<boolean>(true);

    return (
        <FlexCell width="100%">
            <Accordion title="Accordion title" mode="block" value={value} onValueChange={onValueChange}>
                <Text fontSize="16" font="sans">
                    {demoData.loremIpsum}
                </Text>
            </Accordion>
        </FlexCell>
    );
}

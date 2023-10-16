import React from 'react';
import {
    Accordion, FlexCell, FlexRow, Text, Avatar, Badge, FlexSpacer,
} from '@epam/promo';
import { demoData } from '@epam/uui-docs';

const renderTitle = () => (
    <FlexCell grow={ 1 }>
        <FlexRow spacing="12" padding="6">
            <Avatar alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" size="30" />
            <Text fontSize="16" font="sans-semibold">
                John Doe
            </Text>
            <FlexSpacer />
            <Badge color="green" fill="transparent" caption="Employee" />
        </FlexRow>
    </FlexCell>
);

export default function CustomAccordionExample() {
    return (
        <FlexCell grow={ 1 }>
            <Accordion renderTitle={ renderTitle } mode="block">
                <Text fontSize="16" font="sans">
                    {demoData.loremIpsum}
                </Text>
            </Accordion>
        </FlexCell>
    );
}

import React from 'react';
import { Accordion, FlexCell, FlexRow, Text, Avatar, Badge, FlexSpacer } from '@epam/uui';
import { demoData } from '@epam/uui-docs';

const renderTitle = () => (
    <FlexCell grow={ 1 }>
        <FlexRow columnGap="12" padding="6">
            <Avatar alt="avatar" img="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" size="30" />
            <Text fontSize="16" fontWeight="600">
                John Doe
            </Text>
            <FlexSpacer />
            <Badge color="success" fill="outline" indicator={ true } caption="Employee" />
        </FlexRow>
    </FlexCell>
);

export default function CustomAccordionExample() {
    return (
        <FlexCell grow={ 1 }>
            <Accordion renderTitle={ renderTitle } mode="block">
                <Text fontSize="16">
                    {demoData.loremIpsum}
                </Text>
            </Accordion>
        </FlexCell>
    );
}

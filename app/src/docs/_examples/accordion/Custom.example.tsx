import React from 'react';
import { Accordion, FlexCell, FlexRow, Text, Avatar, Badge, FlexSpacer } from '@epam/promo';
import { demoData } from '@epam/uui-docs';

const renderTitle = () => (
    <FlexCell grow={1}>
        <FlexRow spacing="12" padding="6">
            <Avatar alt="avatar" img="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" size="30" />
            <Text fontSize="16" font="sans-semibold">
                John Doe
            </Text>
            <FlexSpacer />
            <Badge color="green" fill="transparent" caption="Employee" />
        </FlexRow>
    </FlexCell>
);

export default function BasicAccordionExample() {
    return (
        <FlexCell grow={1}>
            <Accordion renderTitle={renderTitle} mode="block">
                {demoData.loremIpsum}
            </Accordion>
        </FlexCell>
    );
}

import React from 'react';
import { Accordion, Button, FlexCell, FlexRow, FlexSpacer, Text } from '@epam/promo';
import css from './BasicExample.scss';
import { demoData } from '@epam/uui-docs';

const componentAsDemoContent = (
    <>
        <Text size={'36'} font="sans">
            {demoData.loremIpsum} {demoData.loremIpsum}
        </Text>
        <FlexRow spacing="12">
            <FlexSpacer />
            <Button fill="white" color="gray50" caption="Cancel" onClick={() => {}} />
            <Button color="green" caption="Accept" onClick={() => {}} />
        </FlexRow>
    </>
);

export default function BasicAccordionExample() {
    return (
        <FlexCell width="100%" cx={css.container}>
            <Accordion title="Accordion block mode" mode="block">
                {demoData.loremIpsum}
            </Accordion>
            <Accordion title="Accordion inline mode" mode="inline">
                {demoData.loremIpsum}
            </Accordion>
            <Accordion title="Disabled Accordion" mode="block" isDisabled>
                {demoData.loremIpsum}
            </Accordion>
            <Accordion title="Accordion with react components children" mode="block">
                {componentAsDemoContent}
            </Accordion>
        </FlexCell>
    );
}

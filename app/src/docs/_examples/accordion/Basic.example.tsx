import React from 'react';
import { Accordion, Button, FlexCell, FlexRow, FlexSpacer, Text } from '@epam/uui';
import css from './BasicExample.module.scss';
import { demoData } from '@epam/uui-docs';

const componentAsDemoContent = (
    <>
        <Text fontSize="16">
            {demoData.loremIpsum}
            {' '}
            {demoData.loremIpsum}
        </Text>
        <FlexRow columnGap="12">
            <FlexSpacer />
            <Button fill="outline" color="secondary" caption="Cancel" onClick={ () => {} } />
            <Button caption="Accept" onClick={ () => {} } />
        </FlexRow>
    </>
);

export default function BasicAccordionExample() {
    return (
        <FlexCell width="100%" cx={ css.container }>
            <Accordion title="Accordion block mode" mode="block">
                <Text fontSize="16">
                    {demoData.loremIpsum}
                </Text>
            </Accordion>
            <Accordion title="Accordion inline mode" mode="inline">
                <Text fontSize="16">
                    {demoData.loremIpsum}
                </Text>
            </Accordion>
            <Accordion title="Disabled Accordion" mode="block" isDisabled>
                <Text fontSize="16">
                    {demoData.loremIpsum}
                </Text>
            </Accordion>
            <Accordion title="Accordion with react components children" mode="block">
                {componentAsDemoContent}
            </Accordion>
        </FlexCell>
    );
}

import React from 'react';
import {
    Accordion, Button, FlexCell, FlexRow, FlexSpacer, Text,
} from '@epam/promo';
import css from './BasicExample.module.scss';
import { demoData } from '@epam/uui-docs';

const componentAsDemoContent = (
    <>
        <Text fontSize="16" font="sans">
            {demoData.loremIpsum}
            {' '}
            {demoData.loremIpsum}
        </Text>
        <FlexRow spacing="12">
            <FlexSpacer />
            <Button fill="white" color="gray50" caption="Cancel" onClick={ () => {} } />
            <Button color="green" caption="Accept" onClick={ () => {} } />
        </FlexRow>
    </>
);

export default function BasicAccordionExample() {
    return (
        <FlexCell width="100%" cx={ css.container }>
            <Accordion title="Accordion block mode" mode="block">
                <Text fontSize="16" font="sans">
                    {demoData.loremIpsum}
                </Text>
            </Accordion>
            <Accordion title="Accordion inline mode" mode="inline">
                <Text fontSize="16" font="sans">
                    {demoData.loremIpsum}
                </Text>
            </Accordion>
            <Accordion title="Disabled Accordion" mode="block" isDisabled>
                <Text fontSize="16" font="sans">
                    {demoData.loremIpsum}
                </Text>
            </Accordion>
            <Accordion title="Accordion with react components children" mode="block">
                {componentAsDemoContent}
            </Accordion>
        </FlexCell>
    );
}

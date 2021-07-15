import React from 'react';
import { Accordion, Button, FlexCell, FlexRow, FlexSpacer, Text } from '@epam/promo';
import css from './BasicExample.scss';
import { loremIpsum } from '@epam/uui-docs';

const componentAsDemoContent = <>
    <Text size={ '36' } font='sans'>{loremIpsum} {loremIpsum}</Text>
    <FlexRow spacing='12'>
        <FlexSpacer/>
        <Button fill='white' color='gray50' caption='Cancel' onClick={ () => {} }/>
        <Button color='green' caption='Accept' onClick={ () => {} }/>
    </FlexRow>
</>;

export default function BasicAccordionExample() {
    return (
        <FlexCell width='100%' cx={ css.container }>
            <Accordion title='Accordion block mode' mode='block' >
                { loremIpsum }
            </Accordion>
            <Accordion title='Accordion inline mode' mode='inline' >
                { loremIpsum }
            </Accordion>
            <Accordion title='Disabled Accordion' mode='block' isDisabled >
                { loremIpsum }
            </Accordion>
            <Accordion title='Accordion with react components children' mode='block' >
                { componentAsDemoContent }
            </Accordion>
        </FlexCell>
    );
}
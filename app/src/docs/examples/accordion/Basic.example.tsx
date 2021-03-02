import React from 'react';
import { Accordion, Button, FlexCell, FlexRow, FlexSpacer, Text } from '@epam/promo';
import css from './BasicExample.scss';

const simpleDemoContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt' +
    ' ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut' +
    ' aliquip ex ea commodo consequat.';

const componentAsDemoContent = <>
    <Text size={ '36' } font='sans' > Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
        irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
        anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Text>
    <FlexRow spacing='12'>
        <FlexSpacer/>
        <Button fill='white' color='gray50' caption='Cancel' onClick={ () => {} }/>
        <Button color='green' caption='Accept' onClick={ () => {} }/>
    </FlexRow>
</>;

export function BasicAccordionExample() {
    return (
        <FlexCell width='100%' cx={ css.container }>
            <Accordion title='Accordion block mode' mode='block' >
                { simpleDemoContent }
            </Accordion>
            <Accordion title='Accordion inline mode' mode='inline' >
                { simpleDemoContent }
            </Accordion>
            <Accordion title='Disabled Accordion' mode='block' isDisabled >
                { simpleDemoContent }
            </Accordion>
            <Accordion title='Accordion with react components children' mode='block' >
                { componentAsDemoContent }
            </Accordion>
        </FlexCell>
    );
}
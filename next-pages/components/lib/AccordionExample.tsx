import { Accordion, FlexRow } from '@epam/promo';
import { demoData } from '@epam/uui-docs';
import React from 'react';

export function AccordionExample() {
    return (
        <FlexRow rawProps={ {
            style: {
                width: '100%',
                minWidth: '100%',
            },
        } }
        >
            <Accordion
                title="Accordion block mode"
                mode="block"
            >
                { demoData.loremIpsum }
            </Accordion>
        </FlexRow>
    );
}

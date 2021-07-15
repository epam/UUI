import React, { useState } from 'react';
import { Accordion, FlexCell } from '@epam/promo';
import { loremIpsum } from '@epam/uui-docs';

export default function HandleStateByYourselfExample() {
    const [value, onValueChange] = useState<boolean>(true);

    return (
        <FlexCell width='100%'>
            <Accordion title='Accordion title' mode='block' value={ value } onValueChange={ onValueChange } >
                { loremIpsum }
            </Accordion>
        </FlexCell>
    );
}
import React, { useState } from 'react';
import { Accordion, FlexCell } from '@epam/promo';

const simpleDemoContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt' +
    ' ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi' +
    ' ut aliquip ex ea commodo consequat.';

export default function HandleStateByYourselfExample() {
    const [value, onValueChange] = useState<boolean>(true);

    return (
        <FlexCell width='100%'>
            <Accordion title='Accordion title' mode='block' value={ value } onValueChange={ onValueChange } >
                { simpleDemoContent }
            </Accordion>
        </FlexCell>
    );
}
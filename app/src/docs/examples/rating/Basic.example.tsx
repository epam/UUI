import * as React from 'react';
import { FlexCell, Rating } from '@epam/promo';
import { useState } from 'react';
import * as css from './BasicExample.scss';

export function BasicExample() {
    const [value, onValueChange] = useState(0);

    return (
        <FlexCell width='auto' cx={ css.container } >
            <Rating value={ value } onValueChange={ onValueChange } />
            <Rating isDisabled value={ value } onValueChange={ onValueChange } />
            <Rating isReadonly value={ value } onValueChange={ onValueChange } />
            <Rating isInvalid value={ value } onValueChange={ onValueChange } />
        </FlexCell>
    );
}
import React, { useState } from 'react';
import { FlexCell, Rating } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(0);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <Rating value={ value } onValueChange={ onValueChange } />
            <Rating isDisabled value={ value } onValueChange={ onValueChange } />
            <Rating isReadonly value={ value } onValueChange={ onValueChange } />
        </FlexCell>
    );
}

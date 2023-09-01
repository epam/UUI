import React, { useState } from 'react';
import { FlexCell } from '@epam/uui';
import { SliderRating } from '@epam/loveship';
import css from './BasicExample.module.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <SliderRating from={ 1 } value={ value } onValueChange={ onValueChange } />
        </FlexCell>
    );
}

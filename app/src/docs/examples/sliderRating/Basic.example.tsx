import * as React from 'react';
import { FlexCell } from '@epam/promo';
import { useState } from 'react';
import * as css from './BasicExample.scss';
import { SliderRating } from '@epam/loveship';

export function BasicExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width='auto' cx={ css.container } >
            <SliderRating  from={ 1 } value={ value } onValueChange={ onValueChange } />
        </FlexCell>
    );
}
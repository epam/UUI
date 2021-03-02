import * as React from 'react';
import { FlexCell } from '@epam/promo';
import { useState } from 'react';
import * as css from './BasicExample.scss';
import { Slider } from '@epam/loveship';

export function BasicExample() {
    const [value, onValueChange] = useState(0);

    return (
        <FlexCell width='100%' cx={ css.container } >
            <Slider min={ 0 } max={ 150 } step={ 5 } splitAt={ 25 } value={ value } onValueChange={ onValueChange } />
        </FlexCell>
    );
}
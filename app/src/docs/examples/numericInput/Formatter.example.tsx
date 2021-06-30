import * as React from 'react';
import { FlexCell, NumericInput } from '@epam/promo';
import { useState } from 'react';
import * as css from './BasicExample.scss';

export function BasicExample() {
    const [value, onValueChange] = useState(null);

    const handleFormatter = (value: number): number => {
        const formattedValue = Number(value.toFixed(2));
        return formattedValue;
    }

    return (
        <FlexCell width='auto' cx={ css.container } >
            <NumericInput value={ value } onValueChange={ onValueChange } min={ -10 } max={ 10 } formatter={handleFormatter}/>
        </FlexCell>
    );
}
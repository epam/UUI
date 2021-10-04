import React, { useState } from 'react';
import { FlexCell, NumericInput } from '@epam/promo';
import * as css from './BasicExample.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(null);

    const handleFormatter = (value: number): number => Number(value.toFixed(2));

    return (
        <FlexCell width='auto' cx={ css.container } >
            <NumericInput
                value={ value }
                onValueChange={ onValueChange }
                min={ -10 }
                max={ 10 }
                formatter={handleFormatter}
            />
        </FlexCell>
    );
}
import React, { useState } from 'react';
import { FlexCell, RadioInput } from '@epam/promo';
import css from './BasicExample.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(false);

    return (
        <FlexCell width="auto" cx={css.container}>
            <RadioInput label="Some label" value={value} onValueChange={onValueChange} />
            <RadioInput size="18" label="Size 18px" value={value} onValueChange={onValueChange} />
            <RadioInput size="12" label="Size 12px" value={value} onValueChange={onValueChange} />
            <RadioInput label="Disabled" value={value} onValueChange={onValueChange} isDisabled />
            <RadioInput label="Invalid" value={value} onValueChange={onValueChange} isInvalid />
        </FlexCell>
    );
}

import React from 'react';
import { FlexCell, TextArea, LabeledInput } from '@epam/uui';
import { useState } from 'react';
import css from './BasicExample.module.scss';

export default function WithMaxLengthCounter() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width={ 350 } cx={ css.container }>
            <LabeledInput label="TextArea with max length counter" value={ value } maxLength={ 120 } charCounter={ true }>
                <TextArea maxLength={ 120 } value={ value } onValueChange={ onValueChange } placeholder="maxLenght 120 symbols" />
            </LabeledInput>
        </FlexCell>
    );
}

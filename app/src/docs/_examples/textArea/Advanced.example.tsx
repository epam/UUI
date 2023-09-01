import React from 'react';
import { FlexCell, TextArea } from '@epam/uui';
import { useState } from 'react';
import css from './BasicExample.module.scss';

export default function AdvancedExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width={ 350 } cx={ css.container }>
            <TextArea rows={ 6 } value={ value } onValueChange={ onValueChange } placeholder="6 rows" />
            <TextArea maxLength={ 120 } value={ value } onValueChange={ onValueChange } placeholder="maxLenght 120 symbols" />
            <TextArea autoSize value={ value } onValueChange={ onValueChange } placeholder="autoSize" />
        </FlexCell>
    );
}

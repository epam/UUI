import * as React from 'react';
import { FlexCell, FlexRow, TextArea } from '@epam/promo';
import { useState } from 'react';
import css from './BasicExample.scss';

export function AdvancedExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width={ 350 } cx={ css.container }>
            <TextArea rows={ 6 } value={ value } onValueChange={ onValueChange } placeholder='6 rows' />
            <TextArea maxLength={ 120 } value={ value } onValueChange={ onValueChange } placeholder='maxLenght 120 symbols' />
            <TextArea autoSize value={ value } onValueChange={ onValueChange } placeholder='autoSize' />
        </FlexCell>
    );
}
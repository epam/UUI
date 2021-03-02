import * as React from 'react';
import {Checkbox, FlexCell} from '@epam/promo';
import {useState} from 'react';
import * as css from './BasicExample.scss';

export function BasicExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width='auto' cx={ css.container }>
            <Checkbox label='Some label' value={ value } onValueChange={ onValueChange }/>
            <Checkbox size='18' label='Size 18px' value={ value } onValueChange={ onValueChange }/>
            <Checkbox size='12' label='Size 12px' value={ value } onValueChange={ onValueChange }/>
            <Checkbox label='Disabled' value={ value } onValueChange={ onValueChange } isDisabled/>
            <Checkbox label='Invalid' value={ value } onValueChange={ onValueChange } isInvalid/>
        </FlexCell>
    );
}
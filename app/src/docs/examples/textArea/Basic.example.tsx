import React, { useState } from 'react';
import { FlexCell, TextArea } from '@epam/promo';
import * as css from './BasicExample.scss';


export function BasicTextAreaExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell cx={ css.container } width={ 350 } >
            <TextArea value={ value } onValueChange={ onValueChange }/>
            <TextArea value={ value } onValueChange={ onValueChange } placeholder='Placeholder' />
            <TextArea isDisabled value={ value } onValueChange={ onValueChange } placeholder='Disabled'/>
            <TextArea isReadonly value={ value } onValueChange={ onValueChange } placeholder='Readonly'/>
            <TextArea isInvalid value={ value } onValueChange={ onValueChange } placeholder='Invalid'/>
        </FlexCell>
    );
}
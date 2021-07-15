import React, { useState } from 'react';
import { FlexCell, NumericInput } from '@epam/promo';
import * as css from './BasicExample.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell width='auto' cx={ css.container } >
            <NumericInput value={ value } onValueChange={ onValueChange } min={ -10 } max={ 10 } />
            <NumericInput step={ 2 } value={ value } onValueChange={ onValueChange } min={ -10 } max={ 10 } />
            <NumericInput placeholder='Age' value={ value } onValueChange={ onValueChange } min={ -10 } max={ 10 } />
            <NumericInput value={ value } onValueChange={ onValueChange } min={ -10 } max={ 10 } isDisabled />
            <NumericInput value={ value } onValueChange={ onValueChange } min={ -10 } max={ 10 } isReadonly />
        </FlexCell>
    );
}
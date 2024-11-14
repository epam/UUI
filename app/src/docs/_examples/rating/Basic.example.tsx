import React, { useState } from 'react';
import { FlexCell, Rating } from '@epam/uui';
import { ReactComponent as FavoriteIcon } from '@epam/assets/icons/communication-favorite-fill.svg';
import css from './BasicExample.module.scss';

export default function BasicExample() {
    const [value, onValueChange] = useState(0);
    const [value1, onValueChange1] = useState(0);

    return (
        <FlexCell width="auto" cx={ css.container }>
            <Rating value={ value } onValueChange={ onValueChange } />
            <Rating isDisabled value={ value } onValueChange={ onValueChange } />
            <Rating isReadonly value={ value } onValueChange={ onValueChange } />
            <Rating cx={ css.redFillColor } step={ 0.5 } icon={ FavoriteIcon } value={ value1 } onValueChange={ onValueChange1 } />
        </FlexCell>
    );
}

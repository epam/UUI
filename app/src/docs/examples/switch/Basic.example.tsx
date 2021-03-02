import * as React from 'react';
import {useState} from 'react';
import {FlexCell, Switch} from '@epam/promo';
import * as css from './BasicExample.scss';

export function BasicExample() {
    const [value, onValueChange] = useState(false);

    return (
        <FlexCell width='auto' cx={ css.container }>
            <Switch label='Default' value={ value } onValueChange={ onValueChange }/>
            <Switch size='24' label='Size 24px' value={ value } onValueChange={ onValueChange }/>
            <Switch size='18' label='Size 18px' value={ value } onValueChange={ onValueChange }/>
            <Switch size='12' label='Size 12px' value={ value } onValueChange={ onValueChange }/>
            <Switch label='Disabled' value={ value } onValueChange={ onValueChange } isDisabled/>
        </FlexCell>
    );
}
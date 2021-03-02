import React, { useState } from 'react';
import { FlexCell, TextInput } from '@epam/promo';
import * as css from '../searchInput/DebounceExample.scss';
import customIcon from '@epam/assets/icons/common/social-network-yammer-18.svg';


export function ActionSearchInputExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell cx={ css.container } width='auto' >
            <TextInput icon={ customIcon } onIconClick={ () => {} } value={ value } onValueChange={ onValueChange } placeholder='onIconClick action'/>
            <TextInput onClick={ e => {} } value={ value } onValueChange={ onValueChange } placeholder='onClick action'/>
            <TextInput onFocus={ e => {} } value={ value } onValueChange={ onValueChange } placeholder='onFocus action'/>
            <TextInput onAccept={ () => {} } value={ value } onValueChange={ onValueChange } placeholder='onAccept action'/>
            <TextInput onCancel={ () => {} } value={ value } onValueChange={ onValueChange } placeholder='onCancel action'/>
        </FlexCell>
    );
}
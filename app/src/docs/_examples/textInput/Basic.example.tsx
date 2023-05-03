import React, { useState } from 'react';
import { FlexCell, TextInput } from '@epam/promo';
import css from './BasicExample.scss';
import { ReactComponent as CustomIcon } from '@epam/assets/icons/common/social-network-yammer-18.svg';

export default function BasicTextInputExample() {
    const [value, onValueChange] = useState(null);
    const [valueOpen, onOpenChange] = useState(null);

    return (
        <FlexCell cx={ css.container } width="auto">
            <TextInput value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            <TextInput isDisabled value={ value } onValueChange={ onValueChange } placeholder="Disabled" />
            <TextInput isReadonly value={ value } onValueChange={ onValueChange } placeholder="Readonly" />
            <TextInput isInvalid value={ value } onValueChange={ onValueChange } placeholder="Invalid" />
            <TextInput icon={ CustomIcon } value={ value } onValueChange={ onValueChange } placeholder="Custom Icon" />
            <TextInput icon={ CustomIcon } iconPosition="right" value={ value } onValueChange={ onValueChange } placeholder="Custom Icon on the right" />
            <TextInput isDropdown value={ value } onValueChange={ onValueChange } placeholder="Dropdown" isOpen={ valueOpen } onClick={ () => onOpenChange(!valueOpen) } />
        </FlexCell>
    );
}

import React, { useState } from 'react';
import { FlexCell, LabeledInput, TextInput } from '@epam/uui';
import css from './BasicExample.module.scss';
import { ReactComponent as CustomIcon } from '@epam/assets/icons/common/social-network-yammer-18.svg';

export default function BasicTextInputExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell cx={ css.container } width="auto">
            <LabeledInput label="Label">
                <TextInput value={ value } onValueChange={ onValueChange } placeholder="Please type text" />
            </LabeledInput>
            <LabeledInput label="Disabled">
                <TextInput isDisabled value={ value } onValueChange={ onValueChange } placeholder="Disabled" />
            </LabeledInput>
            <LabeledInput label="Readonly">
                <TextInput isReadonly value={ value } onValueChange={ onValueChange } placeholder="Readonly" />
            </LabeledInput>
            <LabeledInput label="Invalid">
                <TextInput isInvalid value={ value } onValueChange={ onValueChange } placeholder="Invalid" />
            </LabeledInput>
            <LabeledInput label="With icon">
                <TextInput icon={ CustomIcon } value={ value } onValueChange={ onValueChange } placeholder="Custom Icon" />
            </LabeledInput>
            <LabeledInput label="With right icon">
                <TextInput icon={ CustomIcon } iconPosition="right" value={ value } onValueChange={ onValueChange } placeholder="Custom Icon on the right" />
            </LabeledInput>
        </FlexCell>
    );
}

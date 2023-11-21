import React, { useState } from 'react';
import { FlexCell, TextArea, LabeledInput } from '@epam/uui';
import css from './BasicExample.module.scss';

export default function BasicTextAreaExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell cx={ css.container } width={ 350 }>
            <LabeledInput label="Label">
                <TextArea value={ value } onValueChange={ onValueChange } placeholder="Type text" />
            </LabeledInput>
            <LabeledInput label="Disabled">
                <TextArea isDisabled value={ value } onValueChange={ onValueChange } placeholder="Type text" />
            </LabeledInput>
            <LabeledInput label="Readonly">
                <TextArea isReadonly value={ value } onValueChange={ onValueChange } placeholder="Type text" />
            </LabeledInput>
            <LabeledInput label="Invalid">
                <TextArea isInvalid value={ value } onValueChange={ onValueChange } placeholder="Type text" />
            </LabeledInput>
        </FlexCell>
    );
}

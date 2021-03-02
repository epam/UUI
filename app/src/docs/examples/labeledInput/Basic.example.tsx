import React, { useState } from 'react';
import { FlexCell, LabeledInput, TextInput } from '@epam/promo';
import * as css from './BasicExample.scss';

export function BasicTextInputExample() {
    const [value, onValueChange] = useState(null);

    return (
        <FlexCell cx={ css.container } width='auto' >
            <LabeledInput label='Some label' >
                <TextInput value={ value } onValueChange={ onValueChange } placeholder='Please type text' />
            </LabeledInput>
            <LabeledInput label='Left label' labelPosition='left' >
                <TextInput value={ value } onValueChange={ onValueChange } placeholder='Please type text' />
            </LabeledInput>
            <LabeledInput label='Label with tooltip' info='This tooltip can be helpful' >
                <TextInput value={ value } onValueChange={ onValueChange } placeholder='Please type text' />
            </LabeledInput>
            <LabeledInput label='With validation' isInvalid={ !value } validationMessage='This field is mandatory' >
                <TextInput value={ value } isInvalid={ !value } onValueChange={ onValueChange } placeholder='Please type text' />
            </LabeledInput>
        </FlexCell>
    );
}
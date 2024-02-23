import React, { useState } from 'react';
import { LabeledInput, TextInput } from '@epam/uui';

export default function AsyncPickerInputExample() {
    const [value, onValueChange] = useState('');

    return (
        <LabeledInput htmlFor="fullName" label="Full Name">
            <TextInput value={ value } onValueChange={ onValueChange } id="fullName" placeholder="Enter your name" />
        </LabeledInput>
    );
}

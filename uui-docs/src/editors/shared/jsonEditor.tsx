import React from 'react';
import { TextArea } from '@epam/uui';
import { useInputValue } from './utils/hooks';
import { IPropDocEditor } from '../../types';

export function JsonEditor(props: IPropDocEditor) {
    const inputProps = useInputValue<object, string>({
        value: props.value,
        onValueChange: props.onValueChange,
        inputToValue: (i) => i ? JSON.parse(i) : undefined,
        valueToInput: (v) => (v ? JSON.stringify(v, undefined, 1) : ''),
        validateInput: (i) => {
            let isValid;
            try {
                i && JSON.parse(i);
                isValid = true;
            } catch {
                isValid = false;
            }
            return isValid;
        },
    });

    return (
        <TextArea
            placeholder="JSON value"
            onValueChange={ inputProps.onInputChange }
            value={ inputProps.input }
            size="24"
            isInvalid={ !inputProps.isValid }
        />
    );
}

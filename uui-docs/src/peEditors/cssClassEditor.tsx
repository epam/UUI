import * as React from 'react';
import { TextInput, FlexCell } from '@epam/uui';
import { CX } from '@epam/uui-core';
import { getUseInputValueHook } from './utils/hooks';
import { IPropDocEditor } from '../types';

const useInputValue = getUseInputValueHook<CX, string>({
    inputToValue: (i) => i === '' ? undefined : i,
    valueToInput: (v) => (v ? String(v).trim() : ''),
    validateInput: (i) => {
        return i.split(' ').every((s) => {
            if (s.trim()) {
                const matches = s.trim().match(new RegExp(/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/g));
                return matches?.length > 0;
            }
            return true;
        });
    },
});

export function CssClassEditor(props: IPropDocEditor<CX>) {
    const inputProps = useInputValue({ ...props });

    return (
        <FlexCell minWidth={ 150 }>
            <TextInput
                placeholder="CSS class"
                onValueChange={ inputProps.onInputChange }
                value={ inputProps.input }
                size="24"
                isInvalid={ !inputProps.isInputValid }
            />
        </FlexCell>
    );
}

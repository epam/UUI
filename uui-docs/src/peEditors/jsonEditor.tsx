import React from 'react';
import { FlexCell, TextArea } from '@epam/uui';
import { getUseInputValueHook } from './utils/hooks';
import { IPropDocEditor } from '../types';
import { getMultiUnknownExamplesComponent } from './examples/multiUnknownExamples';

const JSonEditorExamples = getMultiUnknownExamplesComponent<object>({ isValueNodeVisible: false });
const valueToInput = (v: object) => (v ? JSON.stringify(v, undefined, 1) : '');
const inputToValue = (i: string) => jsonParse(i);
const validateInput = (i: string) => {
    return i ? !!jsonParse(i) : true;
};
function isEqualValue(v1: object, v2: object) {
    return JSON.stringify(v1) === JSON.stringify(v2);
}
function jsonParse(v: string) {
    try {
        const res = JSON.parse(v);
        if (typeof res === 'object') {
            return res;
        }
    } catch (err) {}
}

const useInputValue = getUseInputValueHook<object, string>({
    valueToInput,
    inputToValue,
    validateInput,
    isEqualValue,
});

export function JsonEditor(props: IPropDocEditor<object>) {
    const inputProps = useInputValue({ ...props });

    const input = (
        <TextArea
            placeholder="JSON value"
            onValueChange={ inputProps.onInputChange }
            value={ inputProps.input }
            size="24"
            autoSize={ true }
            isInvalid={ !inputProps.isInputValid }
        />
    );
    if (props.examples.length > 0) {
        return (
            <>
                <FlexCell minWidth={ 130 }>
                    <JSonEditorExamples { ...props } />
                </FlexCell>
                <FlexCell minWidth={ 170 } grow={ 1 }>
                    {input}
                </FlexCell>
            </>
        );
    }

    return input;
}

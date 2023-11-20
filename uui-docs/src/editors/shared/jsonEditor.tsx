import React from 'react';
import { FlexCell, TextArea } from '@epam/uui';
import { getUseInputValueHook } from './utils/hooks';
import { IPropDocEditor } from '../../types';
import { withMultiUnknownExamplesComponent } from './examples/multiUnknownExamples';

const JSonEditorExamples = withMultiUnknownExamplesComponent({ isValueNodeVisible: false, isVerticalItems: true });
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

    const size = Math.max(inputProps.input?.split('\n').length, 5);
    const input = (
        <TextArea
            placeholder="JSON value"
            onValueChange={ inputProps.onInputChange }
            value={ inputProps.input }
            size="24"
            rows={ size }
            isInvalid={ !inputProps.isInputValid }
        />
    );
    if (props.examples.length > 0) {
        return (
            <>
                <FlexCell minWidth={ 100 }>
                    <JSonEditorExamples
                        { ...props }
                        onExampleIdChange={ props.onExampleIdChange }
                    />
                </FlexCell>
                <FlexCell minWidth={ 200 }>
                    {input}
                </FlexCell>
            </>
        );
    }

    return input;
}

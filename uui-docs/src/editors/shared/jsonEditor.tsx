import React from 'react';
import { FlexCell, TextArea } from '@epam/uui';
import { useInputValue } from './utils/hooks';
import { IPropDocEditor } from '../../types';
import { withMultiUnknownExamplesComponent } from './examples/multiUnknownExamples';

const JSonEditorExamples = withMultiUnknownExamplesComponent({ isValueNodeVisible: false, isVerticalItems: true });

export function JsonEditor(props: IPropDocEditor) {
    const valueToInput = (v: object) => (v ? JSON.stringify(v, undefined, 1) : '');
    const inputProps = useInputValue<object, string>({
        clearWhenInvalid: false,
        value: props.value,
        onValueChange: props.onValueChange,
        inputToValue: (i) => i ? JSON.parse(i) : undefined,
        valueToInput,
        validateInput: (i) => {
            let isValid = true;
            try {
                if (i) {
                    const result = JSON.parse(i);
                    isValid = typeof result === 'object';
                }
            } catch {
                isValid = false;
            }
            return isValid;
        },
    });

    const size = inputProps.input ? inputProps.input.split('\n').length : 3;
    const input = (
        <TextArea
            placeholder="JSON value"
            onValueChange={ inputProps.onInputChange }
            value={ inputProps.input }
            size="24"
            rows={ size }
            isInvalid={ !inputProps.isValid }
        />
    );
    if (props.examples.length > 0) {
        const newOnExampleIdChange = (newExampleId: string) => {
            const newValue = props.examples.find(({ id }) => newExampleId === id).value;
            inputProps.onInputChange(valueToInput(newValue));
            props.onExampleIdChange(newExampleId);
        };
        return (
            <>
                <FlexCell minWidth={ 100 }>
                    <JSonEditorExamples
                        { ...props }
                        onExampleIdChange={ newOnExampleIdChange }
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

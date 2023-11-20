import * as React from 'react';

type TUseInputValueReturn<Input> = {
    input: Input,
    isValid: boolean,
    onInputChange: (input: Input) => void,
};
type TUseInputValueParams<Value, Input> = {
    value: Value,
    onValueChange: (value: Value) => void,
    validateInput: (input: Input) => boolean,
    valueToInput: (value: Value) => Input,
    inputToValue: (input: Input) => Value,
    clearWhenInvalid: boolean,
};
export function useInputValue<Value, Input>(params: TUseInputValueParams<Value, Input>): TUseInputValueReturn<Input> {
    const { value, valueToInput, inputToValue, validateInput, onValueChange } = params;
    const [innerValue, setInnerValue] = React.useState<{ value: Input, isValid: boolean }>(() => ({
        value: valueToInput(value),
        isValid: true,
    }));

    const onInputChange = (input: Input) => {
        const isValid = validateInput(input);
        setInnerValue({
            isValid,
            value: input,
        });
        if (isValid) {
            onValueChange(inputToValue(input));
        } else if (params.clearWhenInvalid) {
            onValueChange(undefined);
        }
    };

    return {
        onInputChange,
        input: innerValue.value,
        isValid: innerValue.isValid,
    };
}

import * as React from 'react';
import { useEffect } from 'react';
import { IPropDocEditor } from '../../types';

interface IGetUseInputValueHookConfig<Value, Input> {
    validateInput: (input: Input) => boolean,
    valueToInput: (value: Value) => Input,
    inputToValue: (input: Input) => Value,
    isEqualValue?: (v1: Value, v2: Value) => boolean,
}
export function getUseInputValueHook<Value, Input>(hookConfig: IGetUseInputValueHookConfig<Value, Input>) {
    const { valueToInput, inputToValue, validateInput, isEqualValue = (v1: Value, v2: Value) => v1 === v2 } = hookConfig;
    type TUseInputValueReturn = {
        input: Input,
        isInputValid: boolean,
        onInputChange: (input: Input) => void,
    };
    return function useInputValue(params: IPropDocEditor<Value>): TUseInputValueReturn {
        const { value, onValueChange, examples, onExampleIdChange } = params;
        const [innerValue, setInnerValue] = React.useState<{ value: Input, isValid: boolean }>(() => ({
            value: valueToInput(value),
            isValid: true,
        }));

        useEffect(() => {
            if (value === undefined) {
                /**
                 * Clears inner input when user explicitly chooses "none" radio button
                 * It's possible to do only when clearWhenInvalid is false
                 */
                setInnerValue({
                    value: valueToInput(undefined),
                    isValid: true,
                });
            } else {
                setInnerValue((prev) => {
                    const equal = isEqualValue(value, inputToValue(prev.value));
                    if (equal) {
                        // It's needed to keep formatting of innerValue
                        return prev;
                    }
                    return {
                        value: valueToInput(value),
                        isValid: true,
                    };
                });
            }
        }, [value]);

        const onInputChange = (input: Input) => {
            const isValid = validateInput(input);
            setInnerValue({
                isValid,
                value: input,
            });
            if (isValid) {
                const newValue = inputToValue(input);
                const ex = examples.find((e) => isEqualValue(e.value, newValue));
                if (ex) {
                    onExampleIdChange(ex.id);
                } else {
                    onValueChange(newValue);
                }
            }
        };

        return {
            onInputChange,
            input: innerValue.value,
            isInputValid: innerValue.isValid,
        };
    };
}

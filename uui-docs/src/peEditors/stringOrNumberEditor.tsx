import React, { useState } from 'react';
import { FlexCell, NumericInput, TextInput } from '@epam/uui';
import { IPropDocEditor } from '../types';
import { getMultiUnknownExamplesComponent } from './examples/multiUnknownExamples';

type TValueType = string | number;

const StringOrNumberEditorExamples = getMultiUnknownExamplesComponent<TValueType>({ isValueNodeVisible: false });

export function StringOrNumberEditor(props: IPropDocEditor<TValueType>) {
    const [inputType, setInputType] = useState<'string' | 'number' | undefined>(() => {
        if (typeof value === 'number') {
            return 'number';
        }
        return 'string';
    });
    const { value, ...restProps } = props;

    let input: React.ReactNode;
    if (typeof value === 'string') {
        input = (
            <TextInput { ...restProps } value={ value } size="24" placeholder="Text value" onCancel={ () => props.onValueChange('') } />
        );
    } else {
        input = (
            <NumericInput
                { ...restProps }
                value={ value }
                size="24"
                placeholder="Numeric value"
                min={ Number.MIN_SAFE_INTEGER }
                formatOptions={
                    { maximumFractionDigits: 10 }
                }
            />
        );
    }

    if (props.examples.length > 0) {
        return (
            <>
                <FlexCell minWidth={ 150 }>
                    <StringOrNumberEditorExamples { ...props } />
                </FlexCell>
                <FlexCell minWidth={ 150 }>
                    {input}
                </FlexCell>
            </>
        );
    }
    return input;
}

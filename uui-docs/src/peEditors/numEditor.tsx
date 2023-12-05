import React from 'react';
import { FlexCell, NumericInput } from '@epam/uui';
import { IPropDocEditor } from '../types';
import { getMultiUnknownExamplesComponent } from './examples/multiUnknownExamples';

const NumEditorExamples = getMultiUnknownExamplesComponent<number>({ isValueNodeVisible: false });

export function NumEditor(props: IPropDocEditor<number>) {
    const input = (
        <NumericInput
            { ...props }
            size="24"
            placeholder="Numeric value"
            min={ Number.MIN_SAFE_INTEGER }
            formatOptions={
                { maximumFractionDigits: 10 }
            }
        />
    );
    if (props.examples.length > 0) {
        return (
            <>
                <FlexCell minWidth={ 150 }>
                    <NumEditorExamples { ...props } />
                </FlexCell>
                <FlexCell minWidth={ 150 }>
                    {input}
                </FlexCell>
            </>
        );
    }
    return input;
}

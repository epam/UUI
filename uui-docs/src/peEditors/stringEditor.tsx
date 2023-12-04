import React from 'react';
import { FlexCell, TextInput } from '@epam/uui';
import { MultiStringExamples } from './examples/multiStringExamples';
import { IPropDocEditor } from '../types';

export function StringEditor(props: IPropDocEditor<string>) {
    return (
        <FlexCell minWidth={ 150 }>
            <TextInput { ...props } size="24" placeholder="Text value" onCancel={ () => props.onValueChange('') } />
        </FlexCell>
    );
}

export function StringWithExamplesEditor(props: IPropDocEditor<string>) {
    return (
        <>
            <FlexCell minWidth={ 150 }>
                <MultiStringExamples { ...props } />
            </FlexCell>
            <FlexCell minWidth={ 150 }>
                <TextInput { ...props } size="24" placeholder="Text value" onCancel={ () => props.onValueChange('') } />
            </FlexCell>
        </>
    );
}

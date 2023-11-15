import React from 'react';
import { FlexCell, TextInput } from '@epam/uui';
import { MultiStringExamples } from './examples/multiStringExamples';
import { ISharedPropEditor } from '../../types';

export function StringEditor(props: ISharedPropEditor<string>) {
    return <TextInput { ...props } size="24" placeholder="Text value" onCancel={ () => props.onValueChange('') } />;
}

export function StringWithExamplesEditor(props: ISharedPropEditor<string>) {
    return (
        <>
            <FlexCell minWidth={ 150 }>
                <MultiStringExamples { ...props } />
            </FlexCell>
            <FlexCell minWidth={ 150 }>
                <StringEditor { ...props } />
            </FlexCell>
        </>
    );
}

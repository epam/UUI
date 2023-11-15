import React from 'react';
import { MultiUnknownExamples } from './examples/multiUnknownExamples';
import { ISharedPropEditor } from '../../types';

export function MultiUnknownEditor(props: ISharedPropEditor) {
    return (
        <MultiUnknownExamples { ...props } />
    );
}

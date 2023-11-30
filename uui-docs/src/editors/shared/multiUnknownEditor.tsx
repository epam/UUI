import React from 'react';
import { MultiUnknownExamples } from './examples/multiUnknownExamples';
import { IPropDocEditor } from '../../types';

export function MultiUnknownEditor(props: IPropDocEditor) {
    return (
        <MultiUnknownExamples { ...props } />
    );
}

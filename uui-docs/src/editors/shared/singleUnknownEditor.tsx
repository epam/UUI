import React from 'react';
import { SingleUnknownExample } from './examples/singleUnknownExample';
import { IPropDocEditor } from '../../types';

export function SingleUnknownEditor(props: IPropDocEditor) {
    return (
        <SingleUnknownExample { ...props } />
    );
}

import React from 'react';
import { SingleUnknownExample } from './examples/singleUnknownExample';
import { ISharedPropEditor } from '../../types';

export function SingleUnknownEditor(props: ISharedPropEditor) {
    return (
        <SingleUnknownExample { ...props } />
    );
}

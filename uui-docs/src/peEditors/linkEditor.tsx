import React from 'react';
import { JsonEditor } from './jsonEditor';
import { IPropDocEditor } from '../types';

export function LinkEditor(props: IPropDocEditor<object>) {
    return (<JsonEditor { ...props } />);
}

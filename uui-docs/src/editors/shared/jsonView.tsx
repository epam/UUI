import React from 'react';
import { Text } from '@epam/uui';
import { IPropDocEditor } from '../../types';

export function JsonView(props: IPropDocEditor) {
    const { value } = props;
    if (value != null) {
        return (<Text>{ JSON.stringify(value) }</Text>);
    }
    return null;
}

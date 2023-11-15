import React from 'react';
import { Text } from '@epam/uui';
import { ISharedPropEditor } from '../../types';

export function JsonView(props: ISharedPropEditor) {
    const { value } = props;
    if (value != null) {
        return (<Text>{ JSON.stringify(value) }</Text>);
    }
    return null;
}

import React from 'react';
import { Text } from '@epam/uui';
import { IPropDocEditor } from '../types';
import { stringifyUnknown } from './utils/propEditorUtils';

export function JsonView(props: IPropDocEditor<object>) {
    const { value } = props;
    if (value != null) {
        return (<Text>{ stringifyUnknown(value) }</Text>);
    }
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <React.Fragment>
            <Text>{value === undefined ? 'undefined' : 'null'}</Text>
        </React.Fragment>
    );
}

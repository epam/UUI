import React from 'react';
import { IconButton, Tooltip } from '@epam/uui';
import { JsonEditor } from './jsonEditor';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-fill-18.svg';
import { IPropDocEditor } from '../../types';

const example = { pathname: '/myPath', query: { myQueryParam1: 'test1', myQueryParam2: 'test2' } };
const tooltipContent = (
    <pre>
        {`E.g.:\n${JSON.stringify(example, undefined, 1)}`}
    </pre>
);

export function LinkEditor(props: IPropDocEditor<object>) {
    return (
        <>
            <JsonEditor { ...props } />
            <Tooltip content={ tooltipContent }>
                <IconButton icon={ InfoIcon } color="neutral" />
            </Tooltip>
        </>

    );
}

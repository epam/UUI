import { uuiMod } from '@epam/uui-core';
import cx from 'classnames';
import React from 'react';
import { useSelected } from 'slate-react';


import css from './Separator.module.scss';

export function Separator(props: any) {
    const { children, attributes } = props;
    const selected = useSelected();

    return (
        <div
            { ...attributes }
            className={ cx(css.separator, selected && uuiMod.focus) }>
            { children }
        </div>
    );
}

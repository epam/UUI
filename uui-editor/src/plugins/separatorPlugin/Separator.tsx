import React, { useEffect } from 'react';
import { useSelected } from 'slate-react';
import cx from 'classnames';
import { uuiMod } from '@epam/uui-core';


import css from './Separator.module.scss';
import { StyledElementProps } from '@udecode/plate-ui';

export function Separator(props: StyledElementProps) {
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

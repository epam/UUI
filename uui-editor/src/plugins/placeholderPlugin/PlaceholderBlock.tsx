import * as React from 'react';
import css from './PlaceholderPlugin.module.scss';
import cx from 'classnames';
import { useSelected } from 'slate-react';
import { uuiMod } from '@epam/uui-core';

export function PlaceholderBlock(props: any) {
    const { attributes, element, children } = props;
    const selected = useSelected();
    const src = element.data.name;

    return (
        <span
            { ...attributes }
            className={ cx(css.placeholderBlock, selected && uuiMod.focus) }
        >
            { src }
            { children }
        </span>
    );
}

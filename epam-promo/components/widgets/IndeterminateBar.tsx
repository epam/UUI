import React from 'react';
import { IHasCX } from '@epam/uui-core';
import cx from 'classnames';
import css from './IndeterminateBar.scss';

export interface IndeterminateBarMods extends IHasCX {
    size?: '12' | '18' | '24';
}

export const IndeterminateBar = (props: IndeterminateBarMods) => {
    return (
        <div className={cx(props.cx, css.root, css[`size-${props.size || 12}`])}>
            <div className={cx(css.bar)} />
        </div>
    );
};

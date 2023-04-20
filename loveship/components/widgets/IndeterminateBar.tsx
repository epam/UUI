import * as React from 'react';
import cx from 'classnames';
import { IHasCX } from '@epam/uui-core';
import css from './IndeterminateBar.scss';

export interface IndeterminateBarMods extends IHasCX {
    size?: '12' | '18' | '24';
}

export const IndeterminateBar = React.forwardRef<HTMLDivElement, IndeterminateBarMods>((props, ref) => {
    return (
        <div ref={ref} className={cx(props.cx, css.root, css[`size-${props.size || 12}`])}>
            <div className={cx(css.bar)} />
        </div>
    );
});

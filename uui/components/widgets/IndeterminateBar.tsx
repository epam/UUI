import * as React from 'react';
import cx from 'classnames';
import { IHasCX } from '@epam/uui-core';
import css from './IndeterminateBar.module.scss';

export interface IndeterminateBarMods extends IHasCX, React.RefAttributes<HTMLDivElement> {
    /** Component size */
    size?: '12' | '18' | '24';
}

export const IndeterminateBar = (props: IndeterminateBarMods) => {
    return (
        <div ref={ props.ref } className={ cx('uui-indeterminate_bar', props.cx, css.root, css[`size-${props.size || 12}`]) }>
            <div className={ cx(css.progressBar) } />
        </div>
    );
};

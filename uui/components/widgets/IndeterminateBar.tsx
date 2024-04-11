import * as React from 'react';
import cx from 'classnames';
import { IHasCX } from '@epam/uui-core';
import css from './IndeterminateBar.module.scss';

export interface IndeterminateBarMods extends IHasCX {
    /** Component size */
    size?: '12' | '18' | '24';
}

export const IndeterminateBar = /* @__PURE__ */React.forwardRef<HTMLDivElement, IndeterminateBarMods>((props, ref) => {
    return (
        <div ref={ ref } className={ cx('uui-indeterminate_bar', props.cx, css.root, css[`size-${props.size || 12}`]) }>
            <div className={ cx(css.progressBar) } />
        </div>
    );
});

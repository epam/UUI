import * as React from 'react';
import cx from 'classnames';
import { devLogger, IHasChildren, IHasCX, IHasRawProps } from '@epam/uui-core';
import * as types from '../types';
import css from './ControlWrapper.module.scss';

interface ControlWrapperProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasChildren {
    /** Defines component size. */
    size: types.ControlSize;
}

export const ControlWrapper = /* @__PURE__ */React.forwardRef<HTMLDivElement, ControlWrapperProps>((props, ref) => {
    if (__DEV__) {
        devLogger.warn('ControlWrapper is deprecated and will be removed in future release.');
    }
    return (
        <div ref={ ref } className={ cx(css.root, css['size-' + props.size], props.cx) } { ...props.rawProps }>
            { props.children }
        </div>
    );
});

import * as React from 'react';
import {
    IHasCX, IHasChildren, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import css from './ControlGroup.module.scss';

export interface ControlGroupProps extends IHasCX, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {}

export const ControlGroup = /* @__PURE__ */React.forwardRef<HTMLDivElement, ControlGroupProps>((props, ref) => {
    return (
        <div role="group" className={ cx(css.container, props.cx) } ref={ ref } { ...props.rawProps }>
            {props.children}
        </div>
    );
});

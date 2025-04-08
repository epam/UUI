import * as React from 'react';
import { IHasCX, IHasChildren, cx, IHasRawProps } from '@epam/uui-core';
import css from './ControlGroup.module.scss';

export interface ControlGroupProps extends IHasCX, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {}

export const ControlGroup = React.forwardRef<HTMLDivElement, ControlGroupProps>((props, ref) => {
    return (
        <div role="group" className={ cx(css.container, props.cx) } ref={ ref } { ...props.rawProps }>
            {props.children}
        </div>
    );
});

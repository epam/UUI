import * as React from 'react';
import { IHasCX, IHasChildren, cx, IHasRawProps } from '@epam/uui-core';
import css from './ControlGroup.module.scss';

export interface ControlGroupProps extends IHasCX, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, React.RefAttributes<HTMLDivElement> {}

export const ControlGroup = (props: ControlGroupProps) => {
    return (
        <div role="group" className={ cx(css.container, props.cx) } ref={ props.ref } { ...props.rawProps }>
            {props.children}
        </div>
    );
};

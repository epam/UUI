import * as React from 'react';
import {
    IHasCX, IHasChildren, cx, IHasRawProps, IHasForwardedRef,
} from '@epam/uui-core';
import css from './ControlGroup.scss';

export interface ControlGroupProps extends IHasCX, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {}

export class ControlGroup extends React.Component<ControlGroupProps> {
    render() {
        return (
            <div role="group" className={ cx(css.container, this.props.cx) } ref={ this.props.forwardedRef } { ...this.props.rawProps }>
                {this.props.children}
            </div>
        );
    }
}

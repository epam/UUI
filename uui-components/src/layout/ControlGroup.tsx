import * as React from 'react';
import * as css from './ControlGroup.scss';
import { IHasCX, IHasChildren, cx, IHasRawProps, IHasForwardedRef } from '@epam/uui';

export interface ControlGroupProps extends IHasCX, IHasChildren, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {}

export class ControlGroup extends React.Component<ControlGroupProps> {
    render() {
        return (
            <div role="group" className={ cx(css.container, this.props.cx) } ref={ this.props.forwardedRef } { ...this.props.rawProps }>
                { this.props.children }
            </div>
        );
    }
}
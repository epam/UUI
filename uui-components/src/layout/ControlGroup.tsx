import * as React from 'react';
import * as css from './ControlGroup.scss';
import { IHasCX, IHasChildren, cx, IHasRawProps } from '@epam/uui';

export interface ControlGroupProps extends IHasCX, IHasChildren, IHasRawProps<HTMLDivElement> {}

export class ControlGroup extends React.Component<ControlGroupProps, any> {
    render() {
        return (
            <div role="group" className={ cx(css.container, this.props.cx) } { ...this.props.rawProps }>
                { this.props.children }
            </div>
        );
    }
}
import * as React from 'react';
import * as css from './ControlGroup.scss';
import { IHasCX, IHasChildren } from '@epam/uui';
import cx from 'classnames';

export interface ControlGroupProps extends IHasCX, IHasChildren {}

export class ControlGroup extends React.Component<ControlGroupProps, any> {
    render() {
        return (
            <div className={ cx(css.container, this.props.cx) }>
                { this.props.children }
            </div>
        );
    }
}
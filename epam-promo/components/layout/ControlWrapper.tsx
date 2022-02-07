import * as React from 'react';
import cx from 'classnames';
import * as css from './ControlWrapper.scss';
import * as types from '../types';
import { IHasCX, IHasForwardedRef, IHasRawProps } from '@epam/uui';

interface ControlWrapperProps extends IHasCX, IHasForwardedRef<HTMLDivElement>, IHasRawProps<HTMLDivElement> {
    size: types.ControlSize;
}

export class ControlWrapper extends React.Component<ControlWrapperProps> {

    render() {
        return (
            <div ref={ this.props.forwardedRef } className={ cx(css.root, css['size-' + this.props.size], this.props.cx) } { ...this.props.rawProps }>
                { this.props.children }
            </div>
        );
    }
}
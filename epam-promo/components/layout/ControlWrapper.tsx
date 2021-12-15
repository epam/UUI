import * as React from 'react';
import * as css from './ControlWrapper.scss';
import * as types from '../types';
import { IHasCX, cx } from '@epam/uui';

interface ControlWrapperProps extends IHasCX {
    size: types.ControlSize;
}

export class ControlWrapper extends React.Component<ControlWrapperProps, any> {

    render() {
        return (
            <div className={ cx(css.root, css['size-' + this.props.size], this.props.cx) }>
                { this.props.children }
            </div>
        );
    }
}
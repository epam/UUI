import * as React from 'react';
import css from './Spinner.module.scss';
import { SpinnerCoreProps, cx } from '@epam/uui-core';

export interface SpinnerProps extends SpinnerCoreProps {}

const QUANTITY_OF_DOTS = 3;

const uuiSpinner: Record<string, string> = {
    container: 'uui-spinner-container',
    dot: 'uui-spinner-dot',
    animation: 'uui-spinner-animation',
    dot1: 'uui-spinner-dot-1',
    dot2: 'uui-spinner-dot-2',
    dot3: 'uui-spinner-dot-3',
};

export class Spinner extends React.Component<SpinnerProps> {
    public render() {
        const dots = [];

        for (let i = 0; i < QUANTITY_OF_DOTS; i += 1) {
            dots.push(<div key={ i } className={ cx(uuiSpinner.dot, uuiSpinner['dot' + (i + 1)]) } />);
        }

        return (
            <div className={ cx(css.container, uuiSpinner.container, this.props.cx) } ref={ this.props.forwardedRef } { ...this.props.rawProps }>
                <div className={ uuiSpinner.animation }>{dots}</div>
            </div>
        );
    }
}

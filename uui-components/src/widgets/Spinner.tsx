import * as React from 'react';
import * as css from './Spinner.scss';
import cx from 'classnames';
import { SpinnerCoreProps } from '@epam/uui';

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

export class Spinner extends React.Component<SpinnerProps, any> {

    public render() {
        const dots = [];

        for (let i = 0; i < QUANTITY_OF_DOTS; i += 1) {
            dots.push(<div key={ i } className={ cx(uuiSpinner.dot, uuiSpinner['dot' + (i + 1)]) }/>);
        }

        return (
            <div className={ cx(css.container, uuiSpinner.container, this.props.cx) }>
                <div className={ uuiSpinner.animation }>{ dots }</div>
            </div>
        );
    }

}
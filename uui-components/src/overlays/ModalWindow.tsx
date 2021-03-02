import * as React from 'react';
import cx from 'classnames';
import { uuiElement, ModalWindowProps } from '@epam/uui';
import { VPanel } from '../layout';

export class ModalWindow extends React.Component<ModalWindowProps, any> {

    render() {
        return (
            <VPanel
                style={ this.props.style }
                cx={ cx(uuiElement.modalWindow, this.props.cx) }
            >
                { this.props.children }
            </VPanel>
        );
    }
}
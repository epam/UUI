import * as React from 'react';
import { uuiElement, ModalWindowProps, cx } from '@epam/uui';
import { VPanel } from '../layout';

export class ModalWindow extends React.Component<ModalWindowProps, any> {
    render() {
        return (
            <VPanel
                style={ this.props.style }
                cx={ cx(uuiElement.modalWindow, this.props.cx) }
                rawProps={this.props.rawProps}
            >
                { this.props.children }
            </VPanel>
        );
    }
}
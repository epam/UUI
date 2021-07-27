import * as React from 'react';
import { uuiElement, ModalWindowProps, cx } from '@epam/uui';
import { VPanel } from '../layout';

export class ModalWindow extends React.Component<ModalWindowProps, any> {
    render() {
        return (
            <VPanel
                style={ { ...this.props.style, ...this.props.rawProps?.style } }
                cx={ cx(uuiElement.modalWindow, this.props.cx, this.props.rawProps?.className) }
                rawProps={this.props.rawProps}
            >
                { this.props.children }
            </VPanel>
        );
    }
}
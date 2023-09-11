import * as React from 'react';
import { uuiElement, ModalWindowProps, cx } from '@epam/uui-core';
import { VPanel } from '../layout';

export class ModalWindow extends React.Component<ModalWindowProps> {
    render() {
        return (
            <VPanel
                style={ this.props.style }
                cx={ cx(uuiElement.modalWindow, this.props.cx) }
                forwardedRef={ this.props.forwardedRef }
                rawProps={ {
                    'aria-modal': true,
                    role: 'dialog',
                    ...this.props.rawProps,
                } }
            >
                {this.props.children}
            </VPanel>
        );
    }
}

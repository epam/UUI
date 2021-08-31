import * as React from 'react';
import FocusLock from 'react-focus-lock';
import * as css from './ModalBlocker.scss';
import { ModalBlockerProps, cx, uuiElement } from '@epam/uui';

export class ModalBlocker extends React.Component<ModalBlockerProps, any> {
    constructor(props: ModalBlockerProps) {
        super(props);
        window.addEventListener('keydown', this.keydownHandler);
    }

    keydownHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            this.props.abort();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keydownHandler);
    }

    private handleBlockerClick = (e: React.SyntheticEvent<Element>) => {
        if (!this.props.disallowClickOutside) {
            this.props.abort();
        }
    }

    render() {
        return (
            <div
                className={ cx(css.container, this.props.cx) }
                style={ { zIndex: this.props.zIndex } }
                {...this.props.rawProps}
            >
                <div className={ uuiElement.modalBlocker } onClick={ this.handleBlockerClick }/>
                <FocusLock autoFocus={ false } returnFocus>
                    { this.props.children }
                </FocusLock>
            </div>
        );
    }
}
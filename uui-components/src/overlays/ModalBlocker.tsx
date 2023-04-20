import * as React from 'react';
import FocusLock from 'react-focus-lock';
import css from './ModalBlocker.scss';
import { ModalBlockerProps, cx, uuiElement } from '@epam/uui-core';

export class ModalBlocker extends React.Component<ModalBlockerProps> {
    constructor(props: ModalBlockerProps) {
        super(props);
    }

    componentDidMount() {
        document.body.style.overflow = 'hidden';
        !this.props.disableCloseByEsc && window.addEventListener('keydown', this.keydownHandler);
    }

    componentWillUnmount() {
        document.body.style.overflow = 'visible';
        !this.props.disableCloseByEsc && window.removeEventListener('keydown', this.keydownHandler);
    }

    keydownHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            this.props.abort();
        }
    };

    private handleBlockerClick = (e: React.SyntheticEvent<Element>) => {
        if (!this.props.disallowClickOutside) {
            this.props.abort();
        }
    };

    render() {
        return (
            <div className={ cx(css.container, this.props.cx) } style={ { zIndex: this.props.zIndex } } ref={ this.props.forwardedRef } { ...this.props.rawProps }>
                <div className={ uuiElement.modalBlocker } onClick={ this.handleBlockerClick } />
                <FocusLock autoFocus={ false } returnFocus disabled={ this.props.disableFocusLock }>
                    {this.props.children}
                </FocusLock>
            </div>
        );
    }
}

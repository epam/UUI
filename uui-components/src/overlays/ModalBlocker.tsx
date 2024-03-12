import * as React from 'react';
import FocusLock from 'react-focus-lock';
import css from './ModalBlocker.module.scss';
import { ModalBlockerProps, UuiContext, UuiContexts, cx, uuiElement } from '@epam/uui-core';

export class ModalBlocker extends React.Component<ModalBlockerProps> {
    public static contextType = UuiContext;
    public context: UuiContexts;

    private unsubscribeFromRouter:() => void | null = null;

    componentDidMount() {
        document.body.style.overflow = 'hidden';
        !this.props.disableCloseByEsc && window.addEventListener('keydown', this.keydownHandler);

        if (!this.props.disableUrlChangeHandler) {
            this.unsubscribeFromRouter = this.context.uuiRouter.listen(() => {
                this.urlChangeHandler();
            });
        }
    }

    componentWillUnmount() {
        !this.props.disableCloseByEsc && window.removeEventListener('keydown', this.keydownHandler);

        if (!this.context.uuiModals.getOperations().length) {
            document.body.style.overflow = 'visible';
        }

        if (this.unsubscribeFromRouter) {
            this.unsubscribeFromRouter();
        }
    }

    urlChangeHandler = () => {
        !this.props.disableUrlChangeHandler && this.context.uuiModals.closeAll();
    };

    keydownHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            this.props.abort();
        }
    };

    private handleBlockerClick = () => {
        if (!this.props.disallowClickOutside) {
            this.props.abort();
        }
    };

    render() {
        return (
            <div className={ cx(css.container, this.props.cx) } style={ { zIndex: this.props.zIndex } } ref={ this.props.forwardedRef } { ...this.props.rawProps }>
                <div
                    className={ uuiElement.modalBlocker }
                    onClick={ this.handleBlockerClick }
                    aria-label="Click to close a modal"
                />
                <FocusLock autoFocus={ false } returnFocus disabled={ this.props.disableFocusLock }>
                    {this.props.children}
                </FocusLock>
            </div>
        );
    }
}

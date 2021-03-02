import * as React from 'react';
import * as css from './ModalBlocker.scss';
import { ModalBlockerProps, cx, uuiElement } from '@epam/uui';
import { SyntheticEvent } from 'react';

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

    private handleBlockerClick = (e: SyntheticEvent<Element>) => {
        if (!this.props.disallowClickOutside) {
            this.props.abort();
        }
    }

    render() {
        return (
            <div className={ cx(css.container, this.props.cx) } style={ { zIndex: this.props.zIndex } } >
                <div className={ uuiElement.modalBlocker } onClick={ this.handleBlockerClick }/>
                { this.props.children }
            </div>
        );
    }
}
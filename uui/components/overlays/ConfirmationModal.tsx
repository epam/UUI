import * as React from 'react';
import { IModal } from '@epam/uui-core';
import { Button } from '../buttons';
import { Panel, ScrollBars } from '../layout';
import { ModalBlocker, ModalWindow, ModalHeader, ModalFooter } from './Modals';
import { i18n } from '../../i18n';

import css from './ConfirmationModal.module.scss';

export interface ConfirmationModalWindowProps extends IModal<any> {
    /** Confirmation modal title */
    caption: any;
    /** Confirmation modal content */
    bodyContent?: any;
    /** Pass true, to hide cancel button */
    hideCancelButton?: boolean;
}

export class ConfirmationModal extends React.Component<ConfirmationModalWindowProps> {
    render() {
        let bodyContent;

        if (this.props.bodyContent) {
            bodyContent = <Panel background="surface-main" margin="24">{this.props.bodyContent}</Panel>;
        }

        return (
            <ModalBlocker { ...this.props }>
                <ModalWindow width={ 420 }>
                    <ModalHeader borderBottom title={ this.props.caption } onClose={ () => this.props.abort() } />
                    <ScrollBars>{bodyContent}</ScrollBars>
                    <ModalFooter cx={ css.footer }>
                        {this.props.hideCancelButton || (
                            <Button caption={ i18n.form.modals.discardButton } onClick={ () => this.props.success(false) } fill="outline" color="secondary" />
                        )}
                        <Button caption={ i18n.form.modals.saveButton } onClick={ () => this.props.success(true) } color="primary" />
                    </ModalFooter>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}

import React from 'react';
import { IModal } from '@epam/uui';
import { ModalBlocker, ModalWindow, FlexSpacer, ModalHeader, Button, ModalFooter, Panel, ScrollBars} from '../';
import { i18n } from '../../i18n';

export interface ConfirmationModalWindowProps extends IModal<any> {
    caption: string;
    bodyContent?: any;
    hideCancelButton?: boolean;
    width?: '300' | '420' | '600' | '900';
}

export class ConfirmationModal extends React.Component<ConfirmationModalWindowProps> {

    render() {
        let bodyContent;

        if (this.props.bodyContent) {
            bodyContent = <Panel margin='24'>
                { this.props.bodyContent }
                </Panel>;
        }

        return <ModalBlocker blockerShadow="dark" { ...this.props }>
        <ModalWindow width={ this.props.width || '420' }>
            <ModalHeader borderBottom title={ this.props.caption } onClose={ () => this.props.abort() } background='white' />
            <ScrollBars>
            { bodyContent }
            </ScrollBars>
            <ModalFooter background='white' borderTop>
                <FlexSpacer />
                { this.props.hideCancelButton || <Button caption={ i18n.confirmationModal.discardButton } onClick={ () => this.props.success(false) } color='night400'/> }
                <Button caption={ i18n.confirmationModal.saveButton } onClick={ () => this.props.success(true) } color='grass'/>
            </ModalFooter>
        </ModalWindow>
    </ ModalBlocker >;
    }
}
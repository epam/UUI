import * as React from 'react';
import { IModal } from '@epam/uui';
import { ModalBlocker, ModalWindow, FlexSpacer, ModalHeader, Button, ModalFooter, Panel, ScrollBars} from '../';
import { i18n } from '../../i18n';

export interface ConfirmationModalWindowProps extends IModal<any> {
    caption: any;
    bodyContent?: any;
    hideCancelButton?: boolean;
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
        <ModalWindow width='420'>
            <ModalHeader borderBottom title={ this.props.caption } onClose={ () => this.props.abort() } background='white' />
            <ScrollBars>
            { bodyContent }
            </ScrollBars>
            <ModalFooter background='white'>
                <FlexSpacer />
                { this.props.hideCancelButton || <Button caption={ i18n.form.modals.discardButton } onClick={ () => this.props.success(false) } fill='white' color='gray50'/> }
                <Button caption={ i18n.form.modals.saveButton } onClick={ () => this.props.success(true) } color='green'/>
            </ModalFooter>
        </ModalWindow>
    </ModalBlocker>;
    }
}
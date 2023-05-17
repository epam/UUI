import * as React from 'react';
import { IModal, UuiContexts } from '@epam/uui-core';
import css from './LinkModal.module.scss';
import { TextInput, ModalHeader, ModalBlocker, ModalWindow, FlexRow, FlexSpacer, LabeledInput, Panel, Button } from '@epam/loveship';
import { i18n } from '../../../i18n';

export interface LinkModalState {
    href: string;
    displayText: string;
    displayTextIsInvalid?: boolean;
    isRemove?: boolean;
    isLinkSelected?: boolean;
}

interface LinkModalProps extends IModal<LinkModalState>, LinkModalState { }

export const showLinkModal = (context: UuiContexts, initialState: LinkModalState) =>
    context.uuiModals.show<LinkModalState>(modalProps => <LinkModal { ...modalProps } { ...initialState } />);

class LinkModal extends React.Component<LinkModalProps, LinkModalState> {

    state = {
        href: this.props.href,
        displayText: this.props.displayText,
        displayTextIsInvalid: false,
    };

    verifyForm = () => {
        this.setState({ displayTextIsInvalid: !this.state.displayText });
        return this.state.displayText;
    }

    render() {
        const displayTextValidationProps = {
            isInvalid: this.state.displayTextIsInvalid,
            validationMessage: i18n.rte.linkModal.validationInputDisplayText,
        };

        return (
            <ModalBlocker { ...this.props }>
                <ModalWindow>
                    <Panel background='white' style={ { overflowY: 'auto', maxHeight: '100%' } } cx='draftRTE__link-modal'>
                        <ModalHeader borderBottom title={ i18n.rte.linkModal.modalHeader } onClose={ () => this.props.abort() } />
                        <FlexRow type='form'>
                            <LabeledInput label={ i18n.rte.linkModal.inputUrl }>
                                <TextInput
                                    value={ this.state.href }
                                    onValueChange={ (value) => this.setState({ href: value }) }
                                />
                            </LabeledInput>
                        </FlexRow>
                        <FlexRow type='form'>
                            <LabeledInput { ...displayTextValidationProps } label={ i18n.rte.linkModal.inputDisplayText }>
                                <TextInput
                                    isInvalid={ this.state.displayTextIsInvalid }
                                    value={ this.state.displayText }
                                    onValueChange={ (value) => this.setState({ displayText: value }) }
                                />
                            </LabeledInput>
                        </FlexRow>
                        <FlexRow padding='24' vPadding='24'>
                            {
                                this.props.isLinkSelected &&
                                <Button
                                    cx={ css.remove }
                                    onClick={ () => this.props.success({
                                        href: this.state.href,
                                        displayText: this.state.displayText,
                                        isRemove: true,
                                    }) }
                                    color='white'
                                    caption={ i18n.rte.linkModal.buttonRemove }
                                />
                            }
                            <FlexSpacer />
                            <Button onClick={ () => this.props.abort() } color='white' caption={ i18n.rte.linkModal.buttonCancel } />
                            <Button
                                onClick={ () => this.verifyForm() && this.props.success({ href: this.state.href, displayText: this.state.displayText }) }
                                color='grass'
                                caption={ i18n.rte.linkModal.buttonOk }
                                cx='draftRTE__link-modal--confirm-button'
                            />
                        </FlexRow>
                    </Panel>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}

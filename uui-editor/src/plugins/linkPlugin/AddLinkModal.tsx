import * as React from 'react';
import { IModal, uuiSkin } from '@epam/uui';
import { FlexSpacer } from '@epam/uui-components';
import * as css from './link.scss';

const { LabeledInput, ModalBlocker, ModalWindow, ModalHeader, FlexRow, TextInput, ModalFooter, Button } = uuiSkin;

interface AddLinkModalProps extends IModal<any> {
    editor: any;
}

export class AddLinkModal extends React.Component<AddLinkModalProps> {
    state = {
        link: '',
        isLinkInvalid: false,
    };

    constructor(props: AddLinkModalProps) {
        super(props);
        let defaultValue = this.props.editor.value.anchorInline ? this.props.editor.value.anchorInline.data.get('url') : '';
        this.state = { link: defaultValue, isLinkInvalid: false };
    }

    render() {
        const linkValidationProps = {
            isInvalid: this.state.isLinkInvalid,
            validationMessage: 'Link is invalid',
        };

        return (
            <ModalBlocker { ...this.props }>
                <ModalWindow>
                    <ModalHeader title="Add link" onClose={ this.props.abort } />
                    <FlexRow cx={ css.inputWrapper }>
                        <LabeledInput label='Link' { ...linkValidationProps }>
                            <TextInput value={ this.state.link } onValueChange={ (newVal) => this.setState({ link: newVal }) } autoFocus/>
                        </LabeledInput>
                    </FlexRow>
                    <ModalFooter borderTop >
                        <FlexSpacer />
                        <Button type='cancel' caption='Delete' onClick={ () => { this.props.editor.unwrapLink(); this.props.abort(); } } />
                        <Button type='success' caption='Save' onClick={ () => {
                            this.props.editor.wrapLink(this.state.link);
                            this.props.success(true);
                        } } />
                    </ModalFooter>
                </ModalWindow>
            </ModalBlocker>
        );
    }

}

import * as React from 'react';
import { IModal, uuiSkin } from '@epam/uui';
import { FlexSpacer } from '@epam/uui-components';
import * as css from './AddVideoModal.scss';
import { getVideoSrc } from '../../helpers';
import { Editor } from "slate-react";

const { LabeledInput, ModalBlocker, ModalWindow, ModalHeader, FlexRow, TextInput, ModalFooter, Button } = uuiSkin;


interface AddVideoModalProps extends IModal<any> {
    editor: Editor;
}

export class AddVideoModal extends React.Component<AddVideoModalProps> {
    state: any = {
        src: '',
        file: null,
    };

    createVideoBlock = () => {
        const src = getVideoSrc(this.state.src);

        const block = ((this.props.editor) as any).createBlock({ src: src }, 'iframe');
        this.props.editor.setBlocks(block) ;
        this.props.success(true);
    }

    render() {
        return (
            <ModalBlocker { ...this.props }>
                <ModalWindow >
                    <ModalHeader title="Add video" onClose={ this.props.abort } />
                    <FlexRow cx={ css.inputWrapper }>
                        <LabeledInput label='Video url' >
                            <TextInput value={ this.state.src } onValueChange={ (newVal) => this.setState({ src: newVal }) } autoFocus/>
                        </LabeledInput>
                    </FlexRow>
                    <ModalFooter borderTop >
                        <FlexSpacer />
                        <Button type='cancel' caption='Cancel' onClick={ () => this.props.abort() } />
                        <Button type='success' caption='Ok' onClick={ this.createVideoBlock }
                        />
                    </ModalFooter>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}

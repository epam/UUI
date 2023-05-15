import * as React from 'react';
import { UploadFileToggler, FlexSpacer } from '@epam/uui-components';
import { IModal, prependHttp, uuiSkin } from '@epam/uui-core';
import css from './AddImageModal.module.scss';
import { Editor } from 'slate-react';

const { LabeledInput, ModalBlocker, ModalWindow, ModalHeader, FlexRow, TextInput, ModalFooter, Button } = uuiSkin;

interface AddImageModalProps extends IModal<any> {
    editor: Editor;
}

export class AddImageModal extends React.Component<AddImageModalProps> {
    state: any = {
        imageURL: '',
        files: null,
    };

    render() {
        return (
            <ModalBlocker { ...this.props }>
                <ModalWindow >
                    <ModalHeader title="Add image" onClose={ this.props.abort } />
                    <FlexRow cx={ css.inputWrapper }>
                        <LabeledInput  label='Image url' >
                            <TextInput value={ this.state.imageURL }  onValueChange={ (newVal) => this.setState({ imageURL: newVal }) } autoFocus />
                        </LabeledInput>
                    </FlexRow>
                    <ModalFooter borderTop >
                        { (this.props.editor as any).handleUploadFile && <UploadFileToggler
                            render={ (props) => <Button { ...props } caption='Select file' /> }
                            onFilesAdded={ (files) => this.setState({ files: files, imageURL: files[0].name }) }
                            accept='image/*'
                        /> }
                        <FlexSpacer />
                        <Button type='cancel' caption='Cancel' onClick={ () => this.props.abort() } />
                        <Button type='success' caption='Ok' isDisabled={ !this.state.imageURL } onClick={ () => {
                            if (this.state.files) {
                                this.state.files.map((file: File) => {
                                    (this.props.editor as any).handleUploadFile(file);
                                });
                            } else {
                                this.props.editor.insertBlock({ data: { src: prependHttp(this.state.imageURL, { https: true }) }, type: 'image' });
                            }
                            this.props.success(true);
                        } }
                        />
                    </ModalFooter>
                </ModalWindow>
            </ModalBlocker>
        );
    }

}

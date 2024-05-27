import React, { useState } from 'react';
import { PlateEditor } from '@udecode/plate-common';
import { IModal } from '@epam/uui-core';
import { UploadFileToggler } from '@epam/uui-components';
import { Button, FlexRow, FlexSpacer, ModalBlocker, ModalFooter, ModalHeader, ModalWindow, LabeledInput, TextInput } from '@epam/uui';

import css from './AddImageModal.module.scss';

interface AddImageModalProps extends IModal<any> {
    editor: PlateEditor;
}

export function AddImageModal(props: AddImageModalProps): JSX.Element {
    const { abort } = props;

    const [imageURL, setImageURL] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    return (
        <ModalBlocker { ...props }>
            <ModalWindow>
                <ModalHeader title="Add image" onClose={ abort } />
                <FlexRow cx={ css.inputWrapper }>
                    <LabeledInput label="Image url">
                        <TextInput
                            value={ imageURL }
                            onValueChange={ (newVal) => {
                                if (newVal) {
                                    setImageURL(newVal);
                                }
                            } }
                            autoFocus
                        />
                    </LabeledInput>
                </FlexRow>
                <ModalFooter borderTop>
                    <UploadFileToggler
                        render={ (props) => <Button color="primary" fill="outline" { ...props } caption="Select file" /> }
                        onFilesAdded={ (acceptedFiles: File[]) => {
                            const urlName = acceptedFiles.map(({ name }) => name).join('; ');
                            setImageURL(urlName);
                            setFiles(acceptedFiles);
                        } }
                        accept="image/*"
                    />
                    <FlexSpacer />
                    <Button color="secondary" fill="outline" caption="Cancel" onClick={ abort } />
                    <Button
                        color="primary"
                        caption="Ok"
                        isDisabled={ !imageURL }
                        onClick={ () => {
                            if (files.length) {
                                props.success(files);
                            } else {
                                props.success(imageURL);
                            }
                        } }
                    />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}

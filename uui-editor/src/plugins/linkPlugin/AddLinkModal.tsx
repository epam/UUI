import React, { useEffect, useState } from 'react';
import { ELEMENT_LINK, insertLink, unwrapLink } from '@udecode/plate-link';
import { PlateEditor, getPluginType, getAboveNode, getSelectionText } from '@udecode/plate-common';
import { IModal } from '@epam/uui-core';
import { FlexRow, FlexSpacer, ModalWindow, ModalBlocker, ModalFooter, ModalHeader, Button, LabeledInput, TextInput } from '@epam/uui';

import css from './link.module.scss';

interface AddLinkModalProps extends IModal<any> {
    editor: PlateEditor;
}

export function AddLinkModal(props: AddLinkModalProps) {
    const [link, setLink] = useState('');
    const isLinkInvalid = false;

    const linkValidationProps = {
        isInvalid: isLinkInvalid,
        validationMessage: 'Link is invalid',
    };

    useEffect(() => {
        const type = getPluginType(props.editor, ELEMENT_LINK);

        const linkNode = getAboveNode(props.editor, {
            match: { type },
        });
        if (linkNode) {
            setLink(linkNode[0].url as string);
        }
    }, [props]);

    return (
        <ModalBlocker { ...props }>
            <ModalWindow>
                <ModalHeader title="Add link" onClose={ props.abort } />
                <FlexRow cx={ css.inputWrapper }>
                    <LabeledInput label="Link" { ...linkValidationProps }>
                        <TextInput value={ link } onValueChange={ (newVal) => setLink(newVal) } autoFocus />
                    </LabeledInput>
                </FlexRow>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button
                        color="secondary"
                        caption="Delete"
                        onClick={ () => {
                            setLink('');
                            unwrapLink(props.editor);
                            props.abort();
                        } }
                    />
                    <Button
                        color="accent"
                        caption="Save"
                        onClick={ () => {
                            link && insertLink(props.editor, { url: link, text: getSelectionText(props.editor), target: '_blank' });
                            props.success(true);
                        } }
                    />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}

import * as React from 'react';

import { IModal, uuiSkin } from '@epam/uui-core';
import { FlexSpacer } from '@epam/uui-components';
import css from './link.module.scss';
import { useEffect, useState } from "react";
import { PlateEditor, getPluginType, getAboveNode, getSelectionText } from '@udecode/plate-common';
import { ELEMENT_LINK, insertLink, unwrapLink } from '@udecode/plate-link';

const { LabeledInput, ModalBlocker, ModalWindow, ModalHeader, FlexRow, TextInput, ModalFooter, Button } = uuiSkin;

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
                        type="cancel"
                        caption="Delete"
                        onClick={ () => {
                            setLink('');
                            unwrapLink(props.editor);
                            props.abort();
                        } }
                    />
                    <Button
                        type="success"
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

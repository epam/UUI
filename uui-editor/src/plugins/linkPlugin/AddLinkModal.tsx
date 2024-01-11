import React, { useState } from 'react';
import { ELEMENT_LINK, TLinkElement, unwrapLink, upsertLink } from '@udecode/plate-link';
import { PlateEditor, getPluginType, getSelectionText, findNode, getEditorString, getAboveNode } from '@udecode/plate-common';
import { IModal } from '@epam/uui-core';
import { FlexRow, FlexSpacer, ModalWindow, ModalBlocker, ModalFooter, ModalHeader, Button, LabeledInput, TextInput } from '@epam/uui';

import css from './link.module.scss';

interface AddLinkModalProps extends IModal<any> {
    editor: PlateEditor;
}

export function AddLinkModal({ editor, ...modalProps }: AddLinkModalProps) {
    const { success, abort } = modalProps;
    const [link, setLink] = useState(() => {
        const type = getPluginType(editor, ELEMENT_LINK);
        const linkNode = getAboveNode(editor, {
            match: { type },
        });
        if (linkNode) {
            return linkNode[0].url as string;
        }
        return '';
    });

    return (
        <ModalBlocker { ...modalProps }>
            <ModalWindow>
                <ModalHeader title="Add link" onClose={ abort } />
                <FlexRow cx={ css.inputWrapper }>
                    <LabeledInput label="Link">
                        <TextInput
                            value={ link }
                            onValueChange={ (newVal) => {
                                setLink(newVal!);
                            } }
                            autoFocus
                        />
                    </LabeledInput>
                </FlexRow>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button
                        color="secondary"
                        caption="Delete"
                        onClick={ () => {
                            setLink('');
                            unwrapLink(editor);
                            abort();
                        } }
                    />
                    <Button
                        color="accent"
                        caption="Save"
                        onClick={ () => {
                            const entry = findNode<TLinkElement>(editor, {
                                match: { type: getPluginType(editor, ELEMENT_LINK) },
                            });

                            let text = getSelectionText(editor);
                            if (entry) {
                                // edit
                                const [, path] = entry;
                                text = getEditorString(editor, path);
                            }
                            upsertLink(editor, { url: link, text, target: '_blank' });
                            success(true);
                        } }
                    />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}

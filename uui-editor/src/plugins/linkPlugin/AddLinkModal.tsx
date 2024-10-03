import React, { useState } from 'react';
import { ELEMENT_LINK, TLinkElement, unwrapLink, upsertLink } from '@udecode/plate-link';
import { PlateEditor, getPluginType, findNode, getAboveNode } from '@udecode/plate-common';
import { IModal } from '@epam/uui-core';
import { FlexRow, ModalWindow, ModalBlocker, ModalFooter, ModalHeader, Button, LabeledInput, TextInput } from '@epam/uui';

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

        if (!editor.selection) {
            return '';
        }

        // selection contains at one edge edge or between the edges
        const linkEntry = findNode<TLinkElement>(editor, {
            at: editor.selection,
            match: { type: getPluginType(editor, ELEMENT_LINK) },
        });
        if (linkEntry) {
            return linkEntry[0].url;
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
                <ModalFooter borderTop cx={ css.footer }>
                    <Button
                        color="secondary"
                        fill="outline"
                        caption="Delete"
                        onClick={ () => {
                            setLink('');
                            unwrapLink(editor);
                            abort();
                        } }
                    />
                    <Button
                        color="primary"
                        caption="Save"
                        onClick={ () => {
                            upsertLink(editor, {
                                url: link,
                                target: '_blank',
                                skipValidation: true,
                            });
                            success(true);
                        } }
                    />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}

import * as React from 'react';
import {
    upsertLinkAtSelection,
    PlateEditor,
    Value,
    getPluginType,
    ELEMENT_LINK,
    getAboveNode,
    unwrapNodes,
    isCollapsed,
} from '@udecode/plate';

import { IModal, uuiSkin } from '@epam/uui-core';
import { FlexSpacer } from '@epam/uui-components';
import * as css from './link.scss';
import { useEffect, useState } from "react";

const { LabeledInput, ModalBlocker, ModalWindow, ModalHeader, FlexRow, TextInput, ModalFooter, Button } = uuiSkin;

interface AddLinkModalProps extends IModal<any> {
    editor: any;
}

const getAndUpsertLink = async <V extends Value>(
    editor: PlateEditor<V>,
    url: string,
) => {
    const type = getPluginType(editor, ELEMENT_LINK);

    const linkNode = getAboveNode(editor, {
        match: { type },
    });

    if (!url) {
        linkNode &&
        editor.selection &&
        unwrapNodes(editor, {
            at: editor.selection,
            match: { type: getPluginType(editor, ELEMENT_LINK) },
        });

        return;
    }

    // If our cursor is in middle of a link, then we don't want to insert it inline
    const shouldWrap: boolean =
        linkNode !== undefined && isCollapsed(editor.selection);
    upsertLinkAtSelection(editor, { url, wrap: shouldWrap });
};

export const AddLinkModal = (props: AddLinkModalProps) => {

    const [link, setLink] = useState('');
    const [isLinkInvalid, setIsLinkInvalid] = useState(false);

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
                    <LabeledInput label='Link' { ...linkValidationProps }>
                        <TextInput value={ link } onValueChange={ (newVal) => setLink(newVal) } autoFocus/>
                    </LabeledInput>
                </FlexRow>
                <ModalFooter borderTop >
                    <FlexSpacer />
                    <Button type='cancel' caption='Delete' onClick={ () => {
                        setLink('');
                        getAndUpsertLink(props.editor, '');
                        props.abort();
                    }} />
                    <Button type='success' caption='Save' onClick={ () => {
                        getAndUpsertLink(props.editor, link);
                        //props.editor.wrapLink(link);
                        props.success(true);
                    } } />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );

}

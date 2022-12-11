import React, { useState } from 'react';

import {
    createMediaEmbedPlugin, focusEditor, insertMediaEmbed, ToolbarButton, useEventPlateId, usePlateEditorRef,
    MediaEmbedToolbarButtonProps,
    ELEMENT_MEDIA_EMBED, Value, TText, EText,
    MediaEmbedElement
} from '@udecode/plate';
import { useUuiContext } from "@epam/uui-core";
import { isPluginActive } from "../../helpers";
import { AddImageModal } from "../implementation/AddImageModal";

export const EmbedUI = <V extends Value = Value, N extends TText = EText<V>>(
    props: any,
) => {
    return <MediaEmbedElement editor={props.editor} attributes={props.attributes} element={props.element} children={props.children}/>
};

export const videoPlugin = createMediaEmbedPlugin({
    key: 'iframe',
    component: EmbedUI,
});


export const MediaEmbedToolbarButton = ({
    id,
    getEmbedUrl,
    isDisabled,
   ...props
}: MediaEmbedToolbarButtonProps) => {
    const editor = usePlateEditorRef(useEventPlateId(id));
    const context = useUuiContext();

    const [open, setOpen] = useState(false);

    const handleMediaInsert = (url: string) => {
        insertMediaEmbed(editor, { url });
        context.uuiModals.closeAll();
    };

    if (!isPluginActive(ELEMENT_MEDIA_EMBED)) return null;

    return (
        <>
            <ToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                onMouseDown={ async (event) => {
                    if (!editor || isDisabled) return;

                    event.preventDefault();

                    let url;
                    if (getEmbedUrl) {
                        url = await getEmbedUrl();
                        if (!url) return;

                        insertMediaEmbed(editor, { url });
                    } else {
                        context.uuiModals.show<string>(modalProps => (
                            <AddImageModal
                                focusEditor={ () => focusEditor(editor) }
                                insertImage={ handleMediaInsert }
                                success={ () => {} }
                                abort={ () => context.uuiModals.closeAll() }
                                isActive={ open }
                                key='image'
                                zIndex={ 100 }
                            />
                        ));
                        setOpen(true);
                    }
                } }
                { ...props }
            />
        </>
    );
};


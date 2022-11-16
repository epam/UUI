import React, { useState, useRef } from 'react';
import cx from 'classnames';
import {
    useEventPlateId,
    usePlateEditorRef,
    insertImage,
    ToolbarButton,
    getBlockAbove,
    ToolbarButtonProps,
    focusEditor,
    PlateEditor,
    getPluginType,
    isMarkActive,
    createPluginFactory,
    ImagePlugin,
    MarkToolbarButton,
    ImageElement,
    Value,
    TText,
    EText,
    withImageUpload,
    StyledLeafProps, usePlateEditorState,
    StyledElementProps,
} from '@udecode/plate';
import { useUuiContext } from "@epam/uui-core";
import { AddImageModal } from "../implementation/AddImageModal";

import { ReactComponent as AlignLeft } from '../icons/align-left.svg';
import { ReactComponent as AlignCenter } from '../icons/align-center.svg';
import { ReactComponent as AlignRight } from '../icons/align-right.svg';
import { ReactComponent as FullWidth } from '../icons/align-full-width.svg';

import * as css from '../../plugins/imagePlugin/ImageBlock.scss';
import { ToolbarButton as UUIToolbarButton } from "../../implementation/ToolbarButton";

export const ImageUI = <V extends Value = Value, N extends TText = EText<V>>(
    props: any,
) => {
    const { attributes, children, element, editor } = props;
    const ref = useRef(null);
    let style: any = {};

    if (editor?.marks?.ALIGN_IMAGE_LEFT) {
        style.display = 'flex';
        style.justifyContent = 'start';
    }

    if (editor?.marks?.ALIGN_IMAGE_RIGHT) {
        style.display = 'flex';
        style.justifyContent = 'end';
    }

    if (editor?.marks?.FULL_WITH_IMAGE && ref?.current?.clientWidth) {
       if (!element?.originalWidth) element.originalWidth = element.width;
       element.width =  ref?.current?.clientWidth;
    } else if (!editor?.marks?.FULL_WITH_IMAGE && element.originalWidth) {
        element.width = element.originalWidth;
    }
    console.log(element);
    return (
        <div style={ style } ref={ ref }>
            <ImageElement editor={ editor } attributes={ attributes } element={ element } children={ children }/>
        </div>
    );
};

export const createImagePlugin = createPluginFactory<ImagePlugin>({
    key: 'image',
    isElement: true,
    isVoid: true,
    withOverrides: withImageUpload,
    handlers: {
        onKeyDown: (editor) => (e) => {
            // focus caption from image
            const entry = getBlockAbove(editor, {
                match: { type: getPluginType(editor, 'img') },
            });
            if (!entry) return;

            // TODO: focus caption from line below image
            // if (isHotkey('up', e)) {
            // }
        },
    },
    then: (editor, { type }) => ({
        deserializeHtml: {
            rules: [
                {
                    validNodeName: 'IMG',
                },
            ],
            getNode: (el) => ({
                type,
                url: el.getAttribute('src'),
            }),
        },
    }),
    plugins: [
        {
            key: 'ALIGN_IMAGE_LEFT',
            type: 'ALIGN_IMAGE_LEFT',
            component: ImageUI,
        },
        {
            key: 'ALIGN_IMAGE_RIGHT',
            type: 'ALIGN_IMAGE_RIGHT',
            component: ImageUI,
        },
        {
            key: 'ALIGN_IMAGE_CENTER',
            type: 'ALIGN_IMAGE_CENTER',
            component: ImageUI,
        },
        {
            key: 'FULL_WITH_IMAGE',
            type: 'FULL_WITH_IMAGE',
            component: ImageUI,
        },
    ],
});

export interface ImageToolbarButtonProps extends ToolbarButtonProps {
    /**
     * Default onMouseDown is getting the image url by calling this promise before inserting the image.
     */
    getImageUrl?: () => Promise<string>;
}

export const InlineToolbarButton = ({ editor }: {editor: PlateEditor}) => {
    return (
        <div className={ cx(css.imageToolbar, 'slate-prevent-blur') }>
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'ALIGN_IMAGE_LEFT') }
                onMouseDown={ (e) => {
                    editor.removeMark('ALIGN_IMAGE_CENTER');
                    editor.removeMark('FULL_WITH_IMAGE');
                    editor.removeMark('ALIGN_IMAGE_RIGHT');

                    if (editor.marks.ALIGN_IMAGE_LEFT) {
                        editor.removeMark('ALIGN_IMAGE_LEFT');
                    } else {
                        editor.addMark('ALIGN_IMAGE_LEFT', true);
                    }
                } }
                icon={ <UUIToolbarButton
                    onClick={ () => {} }
                    icon={ AlignLeft }
                    isActive={ !!editor?.selection && isMarkActive(editor, 'ALIGN_IMAGE_LEFT'!) }
                /> }
            />
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'ALIGN_IMAGE_CENTER') }
                onMouseDown={ (e) => {
                    editor.removeMark('ALIGN_IMAGE_LEFT');
                    editor.removeMark('FULL_WITH_IMAGE');
                    editor.removeMark('ALIGN_IMAGE_RIGHT');

                    if (editor.marks.ALIGN_IMAGE_CENTER) {
                        editor.removeMark('ALIGN_IMAGE_CENTER');
                    } else {
                        editor.addMark('ALIGN_IMAGE_CENTER', true);
                    }
                } }
                icon={ <UUIToolbarButton
                    onClick={ () => {} }
                    icon={ AlignCenter }
                    isActive={ !!editor?.selection && isMarkActive(editor, 'ALIGN_IMAGE_CENTER'!) }
                /> }
            />
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'ALIGN_IMAGE_RIGHT') }
                onMouseDown={ (e) => {
                    editor.removeMark('ALIGN_IMAGE_LEFT');
                    editor.removeMark('FULL_WITH_IMAGE');
                    editor.removeMark('ALIGN_IMAGE_CENTER');

                    if (editor.marks.ALIGN_IMAGE_RIGHT) {
                        editor.removeMark('ALIGN_IMAGE_RIGHT');
                    } else {
                        editor.addMark('ALIGN_IMAGE_RIGHT', true);
                    }
                } }
                icon={ <UUIToolbarButton
                    onClick={ () => {} }
                    icon={ AlignRight }
                    isActive={ !!editor?.selection && isMarkActive(editor, 'ALIGN_IMAGE_RIGHT'!) }
                /> }
            />
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'uui-richTextEditor-bold') }
                onMouseDown={ (e) => {
                    editor.removeMark('ALIGN_IMAGE_LEFT');
                    editor.removeMark('ALIGN_IMAGE_RIGHT');
                    editor.removeMark('ALIGN_IMAGE_CENTER');

                    if (editor.marks.FULL_WITH_IMAGE) {
                        editor.removeMark('FULL_WITH_IMAGE');
                    } else {
                        editor.addMark('FULL_WITH_IMAGE', true);
                    }
                } }
                icon={ <UUIToolbarButton
                    onClick={ () => {} }
                    icon={ FullWidth }
                    isActive={ !!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-bold'!) }
                /> }
            />
        </div>
    );
}

export const ImageToolbarButton = ({
   id,
   getImageUrl,
   ...props
}: ImageToolbarButtonProps) => {
    const editor = usePlateEditorRef(useEventPlateId(id));
    const context = useUuiContext();

    const [open, setOpen] = useState(false);

    const handleImageInsert = (url: string) => {
        insertImage(editor, url);
        context.uuiModals.closeAll();
    };

    return (
        <>
            <ToolbarButton
                onMouseDown={ async (event) => {
                    if (!editor) return;

                    event.preventDefault();

                    let url;
                    if (getImageUrl) {
                        url = await getImageUrl();
                        if (!url) return;

                        insertImage(editor, url);
                    } else {
                        context.uuiModals.show<string>(modalProps => (
                            <AddImageModal
                                focusEditor={ () => focusEditor(editor) }
                                insertImage={ handleImageInsert }
                                success={ () => {} }
                                abort={ () => context.uuiModals.closeAll() }
                                isActive={ open }
                                key='image'
                                zIndex={ 100 }
                            />
                        ))
                        setOpen(true);
                    }
                } }
                { ...props }
            />
        </>
    );
};
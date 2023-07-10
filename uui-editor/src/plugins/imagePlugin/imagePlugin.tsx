import { useUuiContext } from '@epam/uui-core';
import React from 'react';

import { isPluginActive, isTextSelected } from '../../helpers';

import { AddImageModal } from './AddImageModal';
import { Image } from './ImageBlock';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import { PlateEditor, createPluginFactory, focusEditor, getBlockAbove, insertEmptyElement, insertNodes } from '@udecode/plate-common';
import { TImageElement, captionGlobalStore } from '@udecode/plate-media';
import isHotkey from 'is-hotkey';
import { Editor } from 'slate';
import { ReactComponent as ImageIcon } from '../../icons/image.svg';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';

export const IMAGE_PLUGIN_KEY = 'image';
export const IMAGE_PLUGIN_TYPE = 'image';

export const imagePlugin = () => {
    const createImagePlugin = createPluginFactory({
        key: IMAGE_PLUGIN_KEY,
        type: IMAGE_PLUGIN_TYPE,
        isElement: true,
        isVoid: true,
        component: Image,
        then: (editor, { type }) => ({
            deserializeHtml: {
                rules: [{ validNodeName: 'IMG' }],
                getNode: (el) => {
                    const url = el.getAttribute('src');
                    return { type, url };
                },
            },
        }),
        handlers: {
            onKeyDown: (editor) => (event) => {
                const imageEntry = getBlockAbove(editor, { match: { type: IMAGE_PLUGIN_TYPE } })
                if (!imageEntry) return;

                if (event.key === 'Enter') {
                    return insertEmptyElement(editor, PARAGRAPH_TYPE);
                }

                // empty element needs to be added when we have only image element in editor content
                if (event.key === 'Backspace') {
                    insertEmptyElement(editor, PARAGRAPH_TYPE);
                }

                if (event.key === 'Delete') {
                    Editor.deleteForward(editor as any);
                    insertEmptyElement(editor, PARAGRAPH_TYPE);
                }

                // focus caption from image
                if (isHotkey('down', event)) {
                    captionGlobalStore.set.focusEndCaptionPath(imageEntry[1]);
                }
            },
        },
        plugins: [
            {
                key: 'loader',
                type: 'loader',
                isElement: true,
                isVoid: true,
                component: Image,
            },
        ],
    });

    return createImagePlugin();
};

interface IImageButton {
    editor: PlateEditor;
}

export const ImageButton = ({ editor }: IImageButton) => {
    const context = useUuiContext();

    const handleImageInsert = (url: string) => {
        const text = { text: '' };

        const image: TImageElement = {
            align: 'left',
            type: IMAGE_PLUGIN_KEY,
            url: url,
            children: [text],
        };

        insertNodes<TImageElement>(editor, image);
    };

    if (!isPluginActive(IMAGE_PLUGIN_KEY)) return null;
    const block = getBlockAbove(editor);

    return (
        <ToolbarButton
            isDisabled={ isTextSelected(editor, true) }
            onClick={ async (event) => {
                if (!editor) return;
                event.preventDefault();
                event.stopPropagation();

                context.uuiModals.show<string>(modalProps => (
                    <AddImageModal
                        editor={ editor }
                        insertImage={ handleImageInsert }
                        { ...modalProps }
                    />
                )).then(() => {
                    focusEditor(editor); // focusing right after insert leads to bugs
                }).catch((error) => {
                    console.error(error);
                });
            } }
            icon={ ImageIcon }
            isActive={ block?.length && block[0].type === 'image' }
        />
    );
};
import React from 'react';
import { useUuiContext } from '@epam/uui-core';

import {
    createPluginFactory,
    focusEditor,
    getBlockAbove,
    ImagePlugin,
    PlateEditor,
    ToolbarButton as PlateToolbarButton,
    TImageElement,
    insertNodes,
    insertEmptyElement,
    captionGlobalStore,
} from '@udecode/plate';

import { isPluginActive, isTextSelected } from '../../helpers';

import { Image } from './ImageBlock';
import { AddImageModal } from './AddImageModal';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as ImageIcon } from '../../icons/image.svg';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';
import { Editor } from 'slate';
import isHotkey from 'is-hotkey';

export const IMAGE_PLUGIN_KEY = 'image';
export const IMAGE_PLUGIN_TYPE = 'image';

export const imagePlugin = () => {
    const createImagePlugin = createPluginFactory<ImagePlugin>({
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
        <PlateToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            onMouseDown={ async (event) => {
                if (!editor) return;
                event.preventDefault();
                event.stopPropagation();

                context.uuiModals.show<string>(modalProps => (
                    <AddImageModal
                        editor={ editor }
                        focusEditor={ () => focusEditor(editor) }
                        insertImage={ handleImageInsert }
                        { ...modalProps }
                    />
                )).then(() => {
                    focusEditor(editor); // focusing right after insert leads to bugs
                }).catch((error) => {
                    console.error(error);
                });
            } }
            icon={ <ToolbarButton
                isDisabled={ isTextSelected(editor, true) }
                onClick={ () => {} }
                icon={ ImageIcon }
                isActive={ block?.length && block[0].type === 'image' }
            /> }
        />
    );
};
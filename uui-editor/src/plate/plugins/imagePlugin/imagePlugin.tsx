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
} from '@udecode/plate';

import { isPluginActive, isTextSelected } from '../../../helpers';

import { Image } from './ImageBlock';
import { AddImageModal } from './AddImageModal';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as ImageIcon } from '../../icons/image.svg';
import { getBlockAboveByType } from '../../utils/getAboveBlock';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';
import { Editor } from 'slate';

export const IMAGE_PLUGIN_KEY = 'image';

export const imagePlugin = () => {
    const createImagePlugin = createPluginFactory<ImagePlugin>({
        key: IMAGE_PLUGIN_KEY,
        type: 'image',
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
                if (!getBlockAboveByType(editor, ['image'])) return;

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
                focusEditor(editor);
                context.uuiModals.show<string>(modalProps => (
                    <AddImageModal
                        editor={ editor }
                        focusEditor={ () => focusEditor(editor) }
                        insertImage={ handleImageInsert }
                        { ...modalProps }
                    />
                )).catch(() => null);
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
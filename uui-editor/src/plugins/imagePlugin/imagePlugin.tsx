import React from 'react';
import { prependHttp, useUuiContext } from '@epam/uui-core';
import { useIsPluginActive, isTextSelected } from '../../helpers';

import { AddImageModal } from './AddImageModal';
import { Image } from './ImageBlock';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import {
    PlateEditor, createPluginFactory, getBlockAbove, focusEditor, isElement, PlatePlugin, insertNodes, insertEmptyElement,
} from '@udecode/plate-common';
import { ReactComponent as ImageIcon } from '../../icons/image.svg';

import { ModalPayload, TImageElement } from './types';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { IMAGE_PLUGIN_KEY, IMAGE_TYPE } from './constants';
import { useFilesUploader } from '../uploadFilePlugin/file_uploader';
import { normalizeImageElement } from '../../migrations/normalizers';
import { PARAGRAPH_TYPE } from '../paragraphPlugin';

export const imagePlugin = (): PlatePlugin => {
    const createImagePlugin = createPluginFactory<WithToolbarButton>({
        key: IMAGE_PLUGIN_KEY,
        type: IMAGE_TYPE,
        isElement: true,
        isVoid: true,
        component: Image,
        serializeHtml: ({ element }) => {
            const imageElement = element as TImageElement;

            return (
                <div style={ { textAlign: imageElement.align || 'left' } }>
                    <img
                        src={ imageElement.url }
                        style={ {
                            width: imageElement.width,
                        } }
                        alt=""
                    />
                </div>
            );
        },
        then: (_, { type }) => ({
            deserializeHtml: {
                rules: [{ validNodeName: 'IMG' }],
                getNode: (el) => {
                    const url = el.getAttribute('src');
                    return {
                        type,
                        url,
                    };
                },
            },
        }),
        handlers: {
            onKeyDown: (editor) => (event) => {
                const imageEntry = getBlockAbove(editor, { match: { type: IMAGE_TYPE } });
                if (!imageEntry) return;

                if (event.key === 'Enter') {
                    return insertEmptyElement(editor, PARAGRAPH_TYPE);
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
        options: {
            bottomBarButton: ImageButton,
        },
    });

    return createImagePlugin({
        // move to common function / plugin
        withOverrides: (editor) => {
            const { normalizeNode } = editor;

            editor.normalizeNode = (entry) => {
                const [node] = entry;

                if (isElement(node) && node.type === IMAGE_TYPE) {
                    normalizeImageElement(editor, entry);
                }

                normalizeNode(entry);
            };

            return editor;
        },
    });
};

interface IImageButton {
    editor: PlateEditor;
}

export function ImageButton({ editor }: IImageButton) {
    const context = useUuiContext();

    // TODO: make image file upload independent form uploadFilePlugin
    const onFilesAdded = useFilesUploader(editor);

    const onInsertImage = () => {
        const returnSelection = (path?: number[]) => {
            if (path && !!path.length) {
                editor.select(editor.start(path));
                focusEditor(editor);
            }
        };

        const handleInsert = (payload: ModalPayload) => {
            const path = editor.selection?.anchor.path;
            if (typeof payload === 'string') {
                const link = prependHttp(payload, { https: true });
                insertNodes(editor, {
                    align: 'left',
                    url: link,
                    width: 'fit-content', // intial image size before resize
                    type: IMAGE_TYPE,
                    children: [{ text: '' }],
                });
                return path;
            } else {
                return onFilesAdded(payload).then(() => path);
            }
        };

        context.uuiModals.show<ModalPayload>((modalProps) => (
            <AddImageModal
                editor={ editor }
                { ...modalProps }
            />
        ))
            .then(handleInsert)
            .then(returnSelection)
            .catch(console.error);
    };

    // TODO: get rid of that
    if (!useIsPluginActive(IMAGE_PLUGIN_KEY)) return null;
    const block = getBlockAbove(editor);

    return (
        <ToolbarButton
            isDisabled={ isTextSelected(editor, true) }
            onClick={ (event) => {
                event.preventDefault();
                event.stopPropagation();
                onInsertImage();
            } }
            icon={ ImageIcon }
            isActive={ block?.length && block[0].type === IMAGE_TYPE }
        />
    );
}

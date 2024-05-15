import React from 'react';
import { prependHttp, useUuiContext } from '@epam/uui-core';
import { useIsPluginActive, isTextSelected } from '../../helpers';

import { AddImageModal } from './AddImageModal';
import { Image } from './ImageBlock';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import {
    PlateEditor, createPluginFactory, getBlockAbove, insertEmptyElement, focusEditor,
} from '@udecode/plate-common';
import { ReactComponent as ImageIcon } from '../../icons/image.svg';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';

import { IImageElement, ModalPayload } from './types';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { IMAGE_PLUGIN_KEY, IMAGE_PLUGIN_TYPE } from './constants';
import { useFilesUploader } from '../uploadFilePlugin/file_uploader';
import { insertImage } from '@udecode/plate-media';

export const imagePlugin = () => {
    const createImagePlugin = createPluginFactory<WithToolbarButton>({
        key: IMAGE_PLUGIN_KEY,
        type: IMAGE_PLUGIN_TYPE,
        isElement: true,
        isVoid: true,
        component: Image,
        serializeHtml: ({ element }) => {
            const imageElement = element as IImageElement;
            const align = imageElement.align;
            return (
                <div style={ { textAlign: align || 'center' } }>
                    <img
                        src={ element.url as string }
                        style={ { width: imageElement.width } }
                        alt=""
                    />
                </div>
            );
        },
        then: (editor, { type }) => ({
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
                const imageEntry = getBlockAbove(editor, { match: { type: IMAGE_PLUGIN_TYPE } });
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

    return createImagePlugin();
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
                insertImage(editor, link);
                // insertNodes(editor, {
                //     align: 'left',
                //     url: link,
                //     type: IMAGE_PLUGIN_TYPE,
                //     children: [{ text: '' }],
                // });
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
            isActive={ block?.length && block[0].type === 'image' }
        />
    );
}

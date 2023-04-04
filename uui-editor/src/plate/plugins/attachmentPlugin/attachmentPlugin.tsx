import React from 'react';

import { createPluginFactory, getBlockAbove, insertEmptyElement } from '@udecode/plate';

import { AttachmentBlock } from './AttachmentBlock';

export interface UploadFileOptions {
    uploadFile(file: File, onProgress?: (progress: any) => any): Promise<File>;
}

export const ATTACHMENT_KEY = 'attachment';

export const attachmentPlugin = (uploadOptions?: UploadFileOptions) => {
    const createAttachmentPlugin = createPluginFactory({
        key: ATTACHMENT_KEY,
        isElement: true,
        isVoid: true,
        options: {
            uploadOptions
        },
        handlers: {
            onKeyDown: (editor) => (event) => {
                const block = getBlockAbove(editor);
                const type = block?.length && block[0].type;

                if (event.key === 'Enter' && type === 'attachment') {
                    return insertEmptyElement(editor, 'paragraph');
                }

                if ((event.key === 'Backspace' || event.key === 'Delete') && type === 'attachment') {
                    return insertEmptyElement(editor, 'paragraph');
                }
            },
        },
        component: AttachmentBlock,
    });

    return createAttachmentPlugin();
};
import React from 'react';

import { createPluginFactory, getBlockAbove, insertEmptyElement } from '@udecode/plate';

import { AttachmentBlock } from './AttachmentBlock';

const KEY = 'attachment';

export const attachmentPlugin = () => {
    const createAttachmentPlugin = createPluginFactory({
        key: KEY,
        isElement: true,
        isVoid: true,
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
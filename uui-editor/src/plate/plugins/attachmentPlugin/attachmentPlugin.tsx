import { createPluginFactory, insertEmptyElement } from '@udecode/plate';

import { AttachmentBlock } from './AttachmentBlock';
import { getBlockAboveByType } from '../../utils/getAboveBlock';

export const ATTACHMENT_PLUGIN_KEY = 'attachment';

export const attachmentPlugin = () => {
    const createAttachmentPlugin = createPluginFactory({
        key: ATTACHMENT_PLUGIN_KEY,
        isElement: true,
        isVoid: true,
        handlers: {
            onKeyDown: (editor) => (event) => {
                if (!getBlockAboveByType(editor, ['attachment'])) return;

                if (event.key === 'Enter') {
                    return insertEmptyElement(editor, 'paragraph');
                }

                if ((event.key === 'Backspace' || event.key === 'Delete')) {
                    return insertEmptyElement(editor, 'paragraph');
                }
            },
        },
        component: AttachmentBlock,
    });

    return createAttachmentPlugin();
};
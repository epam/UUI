import { Editor } from 'slate';
import { createPluginFactory, insertEmptyElement } from '@udecode/plate';

import { AttachmentBlock } from './AttachmentBlock';
import { getBlockAboveByType } from '../../utils/getAboveBlock';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';

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
                    return insertEmptyElement(editor, PARAGRAPH_TYPE);
                }

                /**
                 * TODO: How it might be solved with deleteBackward / deleteForward methods of plate
                 */
                if (event.key === 'Backspace') {
                    Editor.deleteBackward(editor as any);
                    insertEmptyElement(editor, PARAGRAPH_TYPE);
                    return true;
                }

                if (event.key === 'Delete') {

                    Editor.deleteForward(editor as any);
                    insertEmptyElement(editor, PARAGRAPH_TYPE);
                    return true;
                }
            },
        },
        component: AttachmentBlock,
    });

    return createAttachmentPlugin();
};
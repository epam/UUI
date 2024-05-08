import { AttachmentBlock } from './AttachmentBlock';
import { getBlockAboveByType } from '../../utils/getAboveBlock';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';
import { createPluginFactory, insertEmptyElement } from '@udecode/plate-common';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { AttachFileButton } from './AttachFileButton';
import { ATTACHMENT_PLUGIN_KEY, ATTACHMENT_PLUGIN_TYPE } from './constants';

export const attachmentPlugin = () => {
    const createAttachmentPlugin = createPluginFactory<WithToolbarButton>({
        key: ATTACHMENT_PLUGIN_KEY,
        type: ATTACHMENT_PLUGIN_TYPE,
        isElement: true,
        isVoid: true,
        handlers: {
            onKeyDown: (editor) => (event) => {
                if (!getBlockAboveByType(editor, ['attachment'])) return;

                if (event.key === 'Enter') {
                    return insertEmptyElement(editor, PARAGRAPH_TYPE);
                }
            },
        },
        component: AttachmentBlock,
        options: {
            bottomBarButton: AttachFileButton,
        },
    });

    return createAttachmentPlugin();
};

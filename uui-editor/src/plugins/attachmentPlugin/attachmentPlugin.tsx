import { AttachmentBlock } from './AttachmentBlock';
import { getBlockAboveByType } from '../../utils/getAboveBlock';
import { createPluginFactory, insertEmptyElement, PlatePlugin } from '@udecode/plate-common';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { AttachFileButton } from './AttachFileButton';
import { ATTACHMENT_PLUGIN_KEY, ATTACHMENT_TYPE } from './constants';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/constants';

export const attachmentPlugin = (): PlatePlugin => {
    const createAttachmentPlugin = createPluginFactory<WithToolbarButton>({
        key: ATTACHMENT_PLUGIN_KEY,
        type: ATTACHMENT_TYPE,
        isElement: true,
        isVoid: true,
        handlers: {
            onKeyDown: (editor) => (event) => {
                if (!getBlockAboveByType(editor, [ATTACHMENT_TYPE])) return;

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

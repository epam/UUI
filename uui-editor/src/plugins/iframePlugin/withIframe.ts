import { isElement, Value, PlateEditor } from '@udecode/plate-common';
import { normalizeIframeElement } from '../../migrations';
import { IFRAME_TYPE } from './constants';

export const withIframe = (editor: PlateEditor<Value>) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = (entry) => {
        const [node] = entry;

        if (isElement(node) && node.type === IFRAME_TYPE) {
            normalizeIframeElement(editor, entry);
        }

        normalizeNode(entry);
    };

    return editor;
};

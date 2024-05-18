import { AutoformatBlockRule } from '@udecode/plate-autoformat';
import { isType, PlateEditor } from '@udecode/plate-common';
import { toggleList, unwrapList } from '@udecode/plate-list';
import { getParentNode, isElement } from '@udecode/slate';
import { INLINE_CODE_KEY } from '../inlineCodePlugin/constants';

export const preFormat: AutoformatBlockRule['preFormat'] = (editor) =>
    unwrapList(editor);

export const format = (editor: PlateEditor, customFormatting: any) => {
    if (editor.selection) {
        const parentEntry = getParentNode(editor, editor.selection);
        if (!parentEntry) return;
        const [node] = parentEntry;
        if (
            isElement(node)
        && !isType(editor, node, INLINE_CODE_KEY)
        ) {
            customFormatting();
        }
    }
};

export const formatList = (editor: PlateEditor, elementType: string) => {
    format(editor, () => {
        toggleList(editor, {
            type: elementType,
        });
    });
};

import { PlateEditor, getBlockAbove } from '@udecode/plate-common';

export const getBlockAboveByType = (editor: PlateEditor, type: string[]) => {
    return getBlockAbove(editor, { match: { type } });
};

import { PlateEditor, getBlockAbove } from "@udecode/plate";

export const getBlockAboveByType = (editor: PlateEditor, type: string[]) => {
    return getBlockAbove(editor, { match: { type } });
};

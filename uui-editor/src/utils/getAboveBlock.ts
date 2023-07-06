import { PlateEditor } from "@udecode/plate-core";
import { getBlockAbove } from "@udecode/slate-utils";

export const getBlockAboveByType = (editor: PlateEditor, type: string[]) => {
    return getBlockAbove(editor, { match: { type } });
};

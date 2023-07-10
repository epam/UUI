import { PlateEditor, focusEditor, toggleMark } from "@udecode/plate-common";

export const onClickToolbarButton = (editor: PlateEditor, key: string) => () => {
    toggleMark(editor, { key });
    focusEditor(editor);
}
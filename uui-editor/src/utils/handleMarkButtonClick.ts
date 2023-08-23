import { PlateEditor, focusEditor, toggleMark } from '@udecode/plate-common';

export const handleMarkButtonClick = (editor: PlateEditor, key: string) => () => {
    toggleMark(editor, { key });
    focusEditor(editor);
};

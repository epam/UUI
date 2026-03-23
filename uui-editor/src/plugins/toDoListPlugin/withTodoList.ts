import { PlateEditor } from '@udecode/plate-core';
import { Value } from '@udecode/plate-common';
import { normalizeTodoListElement } from './normalizers';

export const withTodoList = (editor: PlateEditor<Value>) => {
    editor.normalizeNode = normalizeTodoListElement(editor);

    return editor;
};

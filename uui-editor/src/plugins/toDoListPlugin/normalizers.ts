import {
    isElement,
    PlateEditor,
    TNodeEntry,
    Value,
} from '@udecode/plate-common';
import { TTodoListItemElement } from '@udecode/plate-list';
import { migrateCheckedPropertyIfNeeded } from '../../migrations/normalizers';
import { TODO_TYPE } from './constants';

const isTodoListItemElementEntry = (entry: TNodeEntry): entry is TNodeEntry<TTodoListItemElement> =>
    isElement(entry[0]) && entry[0].type === TODO_TYPE;

export const normalizeTodoListElement = <V extends Value>(
    editor: PlateEditor<V>,
) => {
    const { normalizeNode } = editor;

    return (entry: TNodeEntry) => {
        if (isTodoListItemElementEntry(entry)) {
            migrateCheckedPropertyIfNeeded(editor, entry);
        }

        normalizeNode(entry);
    };
};

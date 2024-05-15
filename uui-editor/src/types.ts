import { Value } from '@udecode/plate-common';

export type EditorContent = Value | undefined;

export interface VersionedEditorValue {
    /** content version: for migrations */
    version: string;
    /** content value */
    content: EditorContent;
}

export type DeprecatedEditorValue = EditorContent;

export type EditorValue = VersionedEditorValue | DeprecatedEditorValue;
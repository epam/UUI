import { Range, Editor } from 'slate';
import { getPlugins, useEditorState } from '@udecode/plate-common';
import { EditorValue } from './types';

export function getBlockDesirialiser(blockTags: Record<string, string>) {
    return (el: any, next: any) => {
        const block = blockTags[el.tagName.toLowerCase()];

        if (block) {
            return {
                object: 'block',
                type: block,
                nodes: next(el.childNodes),
            };
        }
    };
}

export function getMarkDeserializer(marks: Record<string, string>) {
    return (el: any, next: any) => {
        const mark = marks[el.tagName.toLowerCase()];

        if (mark) {
            return {
                object: 'mark',
                type: mark,
                nodes: next(el.childNodes),
            };
        }
    };
}

export function isTextSelected(editor: any, inFocus: boolean) {
    const { selection } = editor;

    return !(!selection || !inFocus || Range.isCollapsed(selection) || Editor.string(editor, selection) === '');
}

export function isImageSelected(editor: any) {
    const { selection, getFragment } = editor;
    const node = getFragment()[0]?.type;
    return selection && node === 'image';
}

export function isPluginActive(key: string): boolean {
    const editor = useEditorState();
    const plugins = getPlugins(editor);
    return plugins.some((plugin) => plugin.key === key);
}

export const isEditorValueEmpty = (value: EditorValue) => {
    return (
        !value
        || (value.length === 0
        || (value.length === 1 && value[0].type === 'paragraph' && value[0].children[0].text === ''))
    );
};

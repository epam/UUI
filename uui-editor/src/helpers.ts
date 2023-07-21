// import flatten from 'lodash.flatten';
// import Html from 'slate-html-serializer';
import { Range, Editor } from 'slate';
import { getPlugins, usePlateEditorState } from "@udecode/plate-common";
import { EditorValue } from './types';
//
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
//
// export function getSerializer(plugins: any) {
//     let rules: any = [];
//     flatten(plugins).map((plugin: any) => {
//         plugin.serializers && plugin.serializers.map((serializer: any) => {
//             rules.push({
//                 deserialize: serializer,
//             });
//         });
//     });
//     return new Html({ rules: rules });
// }
//
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
    const editor = usePlateEditorState();
    const plugins = getPlugins(editor);
    return plugins.some(plugin => plugin.key === key);
}

export const isElementEmpty = (value: EditorValue) => {
    if (!value || value?.length > 1) {
        return false;
    }

    const [first] = value;
    return (
        value.length === 0 ||
        (value.length === 1 &&
            first.type === 'paragraph' &&
            first.children[0].text === '')
    );
};

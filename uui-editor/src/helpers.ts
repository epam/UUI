// import flatten from 'lodash.flatten';
// import Html from 'slate-html-serializer';
import { Range, Editor } from 'slate';
import { getPlugins, usePlateEditorState } from "@udecode/plate-common";
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

//
// export const isEditorEmpty = (value: Value) => {
//     const blocks: Block[] = value.get('document').get('nodes').toArray();
//
//     if (blocks.length === 1 && blocks[0].get('type') === 'paragraph') {
//         const nodes: SlateText[] = blocks[0].get('nodes').toArray();
//
//         if (nodes.length === 1 && nodes[0].get('text') === '') {
//             return true;
//         }
//     }
//
//     return false;
// };
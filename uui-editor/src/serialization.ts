import {
    PlatePlugin,
    Value,
    createNode,
    deserializeHtml,
    parseHtmlDocument,
} from '@udecode/plate-common';
import { serializeHtml } from '@udecode/plate-serializer-html';
import { EditorValue } from './types';
import {
    baseMarksPlugin,
    headerPlugin,
    superscriptPlugin,
    listPlugin,
    quotePlugin,
    linkPlugin,
    imagePlugin,
    videoPlugin,
    iframePlugin,
    codeBlockPlugin,
    paragraphPlugin,
    boldPlugin,
    italicPlugin,
    PARAGRAPH_TYPE,
} from './plugins';
import { createTempEditor, getEditorValue } from './helpers';
import { BaseEditor, Editor } from 'slate';
import { createDeserializeMdPlugin, deserializeMd } from './plugins/deserializeMdPlugin/deserializeMdPlugin';
import { serializeMd } from '@udecode/plate-serializer-md';

type SerializerType = 'html' | 'md';

export const htmlSerializationsWorkingPlugins: PlatePlugin[] = [
    ...baseMarksPlugin(),
    paragraphPlugin(),
    headerPlugin(),
    superscriptPlugin(),
    listPlugin(),
    quotePlugin(),
    linkPlugin(),
    imagePlugin(),
    videoPlugin(),
    iframePlugin(),
    codeBlockPlugin(),
];

export const mdSerializationsWorkingPlugins: PlatePlugin[] = [
    createDeserializeMdPlugin(),
    boldPlugin(),
    italicPlugin(),
    paragraphPlugin(),
    linkPlugin(),
    listPlugin(),
    headerPlugin(),
    // quotePlugin,
    // separatorPlugin,
    // inlineCodePlugin
    // underline
    // image
    // strikethrough
    // superscript
    // subscript
    // code blocks
    // tables
];

export const createDeserializer = (type: SerializerType = 'html') => {
    if (type === 'html') {
        const editor = createTempEditor(htmlSerializationsWorkingPlugins);
        return (data: string) => {
            const document = parseHtmlDocument(data);
            return deserializeHtml(editor, { element: document.body }) as EditorValue;
        };
    } else {
        const editor = createTempEditor(mdSerializationsWorkingPlugins);
        return (data: string) => {
            editor.children = deserializeMd<Value>(editor, data);
            Editor.normalize(editor as BaseEditor, { force: true });

            // escape from invalid empty state
            return !!editor.children.length
                ? (editor.children as EditorValue)
                : [createNode(PARAGRAPH_TYPE)];
        };
    }
};

export const createSerializer = (type: SerializerType = 'html') => {
    if (type === 'html') {
        const editor = createTempEditor(htmlSerializationsWorkingPlugins);
        return (value: EditorValue) => {
            const [v] = getEditorValue(value);
            return serializeHtml(editor, { nodes: v! }); // TODO: improve typing
        };
    } else {
        const editor = createTempEditor(mdSerializationsWorkingPlugins);
        return (value: EditorValue) => {
            const [v] = getEditorValue(value);
            return serializeMd(editor, { nodes: v! }); // TODO: improve typing
        };
    }
};

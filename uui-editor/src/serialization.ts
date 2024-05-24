import {
    PlatePlugin,
    Value,
    createNode,
    deserializeHtml,
    parseHtmlDocument,
    PlateEditor,
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
    separatorPlugin,
} from './plugins';
import { createTempEditor } from './helpers';
import { createDeserializeMdPlugin, deserializeMd } from './plugins/deserializeMdPlugin';
import { serializeMd } from '@udecode/plate-serializer-md';
import { migrateLegacySchema } from './migrations/legacy_migrations';

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
    separatorPlugin(),
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
            editor.normalize({ force: true });

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
        return (v: EditorValue) => {
            const value = initializeEditor(editor, v);
            return serializeHtml(editor, { nodes: value });
        };
    } else {
        const editor = createTempEditor(mdSerializationsWorkingPlugins);
        return (v: EditorValue) => {
            const value = initializeEditor(editor, v);

            return serializeMd(editor, { nodes: value });
        };
    }
};

/** Consider slate and plate migarions */
const initializeEditor = (editor: PlateEditor<Value>, v: EditorValue): Value => {
    let value: Value;
    if (!v) {
        value = [createNode(PARAGRAPH_TYPE)];
    } else {
        if (!Array.isArray(v)) {
            value = migrateLegacySchema(v); // slate migraitons
        } else {
            value = v;
        }
    }

    editor.children = value;
    editor.normalize({ force: true }); // plate migratoins

    return editor.children;
};

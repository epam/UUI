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

export const defaultHtmlSerializationsWorkingPlugins: PlatePlugin[] = [
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

export const defaultMdSerializationsWorkingPlugins: PlatePlugin[] = [
    createDeserializeMdPlugin(),
    boldPlugin(),
    italicPlugin(),
    paragraphPlugin(),
    linkPlugin(),
    listPlugin(),
    headerPlugin(),
];

interface RteConverterOptions {
    /**
     * Plugins to use for (de)serialization.
     * If not provided, defaults to `defaultHtmlSerializationsWorkingPlugins` for HTML and `mdSerializationsWorkingPlugins` for Markdown.
     */
    plugins?: PlatePlugin[];
}

export const createDeserializer = (type: SerializerType = 'html', options: RteConverterOptions) => {
    if (type === 'html') {
        const editor = createTempEditor(options.plugins || defaultHtmlSerializationsWorkingPlugins);
        return (data: string) => {
            const document = parseHtmlDocument(data);
            return deserializeHtml(editor, { element: document.body }) as EditorValue;
        };
    } else {
        const editor = createTempEditor(options.plugins || defaultMdSerializationsWorkingPlugins);
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

export const createSerializer = (type: SerializerType = 'html', options: RteConverterOptions) => {
    if (type === 'html') {
        const editor = createTempEditor(options.plugins || defaultHtmlSerializationsWorkingPlugins);
        return (v: EditorValue) => {
            const value = initializeEditor(editor, v);
            return serializeHtml(editor, { nodes: value, convertNewLinesToHtmlBr: true });
        };
    } else {
        const editor = createTempEditor(options.plugins || defaultMdSerializationsWorkingPlugins);
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

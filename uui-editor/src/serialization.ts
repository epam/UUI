import {
    PlatePlugin,
    Value,
    deserializeHtml,
    parseHtmlDocument,
} from '@udecode/plate-common';
import { serializeHtml } from '@udecode/plate-serializer-html';
import { EditorValue } from './types';
import { migrateSchema } from './migration';
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
    separatorPlugin,
} from './plugins';
import { deserializeMd } from '@udecode/plate-serializer-md';
import { remarkNodeTypesMap, serialize } from './remark-slate';
import { createTempEditor } from './helpers';

export type SerializerType = 'html' | 'md';

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
    ...baseMarksPlugin(),
    quotePlugin(),
    paragraphPlugin(),
    linkPlugin(),
    listPlugin(),
    headerPlugin(),
    imagePlugin(),
    separatorPlugin(),
    codeBlockPlugin(),
    // underline
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
            return deserializeMd<Value>(editor, data);
        };
    }
};

export const createSerializer = (type: SerializerType = 'html') => {
    if (type === 'html') {
        const editor = createTempEditor(htmlSerializationsWorkingPlugins);
        return (value: EditorValue) => {
            return serializeHtml(editor, {
                nodes: migrateSchema(value),
            });
        };
    } else {
        return (value: EditorValue) => {
            return value?.map((v) => serialize(
                v,
                {
                    nodeTypes: remarkNodeTypesMap,
                    ignoreParagraphNewline: true,
                },
            )).join('');
        };
    }
};

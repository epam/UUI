import {
    PlatePlugin,
    createPlateEditor,
    createPlugins,
    deserializeHtml,
    parseHtmlDocument,
} from '@udecode/plate-common';
import { serializeHtml } from '@udecode/plate-serializer-html';
import { createPlateUI } from './components';
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
} from './plugins';

const workingPlugins = [
    paragraphPlugin(),
    baseMarksPlugin(),
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

export const createTempEditor = (plugins?: PlatePlugin[]) => {
    return createPlateEditor({
        plugins: createPlugins((plugins || workingPlugins).flat(), {
            components: createPlateUI(),
        }),
    });
};

export const createDeserializer = () => {
    const editor = createTempEditor();

    return (data: string) => {
        const document = parseHtmlDocument(data);
        return deserializeHtml(editor, { element: document.body }) as EditorValue;
    };
};

export const createSerializer = () => {
    const editor = createTempEditor();

    return (value: EditorValue) => {
        return serializeHtml(editor, {
            nodes: migrateSchema(value),
        });
    };
};

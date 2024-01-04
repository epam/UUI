import fs from 'fs';
import path from 'path';
import { createTempEditor } from '../serialization';
import {
    baseMarksPlugin,
    headerPlugin,
    colorPlugin,
    superscriptPlugin,
    listPlugin,
    toDoListPlugin,
    quotePlugin,
    linkPlugin,
    notePlugin,
    uploadFilePlugin,
    attachmentPlugin,
    imagePlugin,
    videoPlugin,
    iframePlugin,
    separatorPlugin,
    tablePlugin,
    codeBlockPlugin,
} from '../plugins';
import { defaultPlugins } from '../defaultPlugins';
import { createPlateEditor } from '@udecode/plate-core';

export const readTestFile = (filepath: string): string => {
    const absoluteFilepath = path.resolve(__dirname, filepath);
    return fs.readFileSync(absoluteFilepath, 'utf8');
};

export const createClipboardData = (html: string, rtf?: string): DataTransfer =>
    ({
        getData: (format: string) => (format === 'text/html' ? html : rtf),
    } as any);

const plugins = [
    ...defaultPlugins,
    baseMarksPlugin(),
    headerPlugin(),
    colorPlugin(),
    superscriptPlugin(),
    listPlugin(),
    toDoListPlugin(),
    quotePlugin(),
    linkPlugin(),
    notePlugin(),
    uploadFilePlugin({}),
    attachmentPlugin(),
    imagePlugin(),
    videoPlugin(),
    iframePlugin(),
    separatorPlugin(),
    tablePlugin(),
    codeBlockPlugin(),
    // placeholderPlugin(),
];

const initEditor = () => {
    const editor = createTempEditor(plugins);
    editor.children = [
        {
            data: {},
            type: 'paragraph',
            children: [
                {
                    text: '',
                },
            ],
        },
    ];
    return createPlateEditor({ editor, plugins });
};

describe('serialization', () => {
    it('should paste data with tables', async () => {
        const editor = initEditor();

        const data = createClipboardData(readTestFile('./tables.html'));
        editor.insertData(data);

        expect(editor.children).toMatchSnapshot();
    });
});

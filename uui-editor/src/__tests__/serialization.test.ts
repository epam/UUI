import fs from 'fs';
import path from 'path';
import { createDeserializer, createSerializer } from '../serialization';
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
import { PlatePlugin } from '@udecode/plate-common';
import { createTempEditor } from '../helpers';
import { expectedSlateValue, inputMarkdowValue, editorValueMock } from './data/md-serialization';
import { PARAGRAPH_TYPE } from '../plugins/paragraphPlugin';

export const readTestFile = (filepath: string): string => {
    const absoluteFilepath = path.resolve(__dirname, filepath);
    return fs.readFileSync(absoluteFilepath, 'utf8');
};

export const createClipboardData = (html: string, rtf?: string): DataTransfer =>
    ({
        getData: (format: string) => (format === 'text/html' ? html : rtf),
    } as any);

const plugins: PlatePlugin[] = [
    ...baseMarksPlugin(),
    ...defaultPlugins,
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
];

const initEditor = () => {
    const editor = createTempEditor(plugins);
    editor.children = [
        {
            data: {},
            type: PARAGRAPH_TYPE,
            children: [
                {
                    text: '',
                },
            ],
        },
    ];

    return editor;
};

describe('serialization', () => {
    it('should paste data with tables', async () => {
        const editor = initEditor();

        const data = createClipboardData(readTestFile('./data/serialization.html'));
        editor.insertData(data);

        expect(editor.children).toMatchSnapshot();
    });

    it('should serialize markdown', async () => {
        const serializeMd = createSerializer('md');
        const serializedMd = serializeMd(editorValueMock);
        expect(serializedMd).toMatchSnapshot();
    });

    it('should deserialize markdown', async () => {
        const deserializeMd = createDeserializer('md');
        const deserializedMd = deserializeMd(inputMarkdowValue);
        expect(deserializedMd).toEqual(expectedSlateValue);
    });
});

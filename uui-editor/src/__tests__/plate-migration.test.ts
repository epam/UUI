import { PlatePlugin } from '@udecode/plate-common';
import { defaultPlugins } from '../defaultPlugins';
import { createTempEditor } from '../helpers';
import { baseMarksPlugin, headerPlugin, colorPlugin, superscriptPlugin, listPlugin, toDoListPlugin, quotePlugin, linkPlugin, notePlugin, uploadFilePlugin, attachmentPlugin, imagePlugin, videoPlugin, iframePlugin, separatorPlugin, tablePlugin, codeBlockPlugin } from '../plugins';
import { initialValue } from './data/plate-migration';

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

describe('migrate', () => {
    describe('plate', () => {
        it('should migrate content correctly', () => {
            const editor = createTempEditor(plugins);
            editor.children = initialValue;

            editor.normalize({ force: true });

            const migrated = editor.children;
            expect(migrated).toMatchSnapshot();
        });
    });
});

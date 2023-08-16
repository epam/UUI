import { createPlateEditor, createPlugins } from '@udecode/plate-common';
import { serializeHtml } from '@udecode/plate-serializer-html';
import { createPlateUI } from './components';
import { EditorValue } from './types';
import { migrateSchema } from './migration';

export const createSerializer = (plugins: any[]) => {
    const editor = createPlateEditor({
        plugins: createPlugins((plugins || []).flat(), {
            components: createPlateUI(),
        }),
    });

    return (value: EditorValue) => {
        return serializeHtml(editor, {
            nodes: migrateSchema(value),
        });
    };
};

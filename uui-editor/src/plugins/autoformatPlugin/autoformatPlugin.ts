import { createAutoformatPlugin as createRootAutoformatPlugin } from '@udecode/plate-autoformat';
import { PlatePlugin } from '@udecode/plate-common';
import { autoformatLists } from './formatLists';

export const createAutoformatPlugin = (): PlatePlugin => createRootAutoformatPlugin({
    options: {
        rules: autoformatLists,
        enableUndoOnDelete: true,
    },
});

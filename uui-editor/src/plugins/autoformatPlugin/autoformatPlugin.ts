import { createAutoformatPlugin as createRootAutoformatPlugin } from '@udecode/plate-autoformat';
import { autoformatLists } from './formatLists';

export const createAutoformatPlugin = () => createRootAutoformatPlugin({
    options: {
        rules: autoformatLists,
        enableUndoOnDelete: true,
    },
});

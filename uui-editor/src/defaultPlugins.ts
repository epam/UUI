import { createJuicePlugin } from '@udecode/plate-juice';
import { createDeserializeDocxPlugin } from '@udecode/plate-serializer-docx';
import { isBlockAboveEmpty, isSelectionAtBlockStart, PlatePlugin } from '@udecode/plate-common';
import { type ResetNodePlugin, createResetNodePlugin } from '@udecode/plate-reset-node';
import { createSoftBreakPlugin } from '@udecode/plate-break';
import {
    paragraphPlugin,
    PARAGRAPH_TYPE,
    noteTypes,
    QUOTE_TYPE,
    TODO_TYPE,
} from './plugins';
import { createAutoformatPlugin } from './plugins/autoformatPlugin';
import { createEventEditorPlugin } from './plugins/eventEditorPlugin';

const resetBlockTypesCommonRule = {
    types: [
        QUOTE_TYPE,
        TODO_TYPE,
        ...noteTypes,
    ],
    defaultType: PARAGRAPH_TYPE,
};

const resetBlockTypePlugin: Partial<PlatePlugin<ResetNodePlugin>> = {
    options: {
        rules: [
            {
                ...resetBlockTypesCommonRule,
                hotkey: 'Enter',
                predicate: isBlockAboveEmpty,
            },
            {
                ...resetBlockTypesCommonRule,
                hotkey: 'Backspace',
                predicate: isSelectionAtBlockStart,
            },
        ],
    },
};

/**
 * Please make sure defaultPlugins and all your plugins are not interfere
 * with the following list when disableCorePlugins prop hasn't been set
 * https://github.com/udecode/plate/blob/main/docs/BREAKING_CHANGES.md#general
 */
export const defaultPlugins: PlatePlugin[] = [
    createDeserializeDocxPlugin(), // depends on juice plugin
    createJuicePlugin(),
    paragraphPlugin(),
    createResetNodePlugin(resetBlockTypePlugin),
    createSoftBreakPlugin(),
    createAutoformatPlugin(), // TODO: should only be enabled if lists plugin listed
    createEventEditorPlugin(),
];

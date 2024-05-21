import { createJuicePlugin } from '@udecode/plate-juice';
import { createDeserializeDocxPlugin } from '@udecode/plate-serializer-docx';
import { isBlockAboveEmpty, isSelectionAtBlockStart } from '@udecode/plate-common';
import { ResetNodePlugin, createResetNodePlugin } from '@udecode/plate-reset-node';
import { createSoftBreakPlugin } from '@udecode/plate-break';
import {
    paragraphPlugin,
    PARAGRAPH_TYPE,
    QUOTE_PLUGIN_KEY,
    TODO_ELEMENT_KEY,
    noteTypes,
} from './plugins';
import { createAutoformatPlugin } from './plugins/autoformatPlugin/autoformatPlugin';
import { createEventEditorPlugin } from './plugins/eventEditorPlugin/eventEditorPlugin';

const resetBlockTypesCommonRule = {
    types: [
        QUOTE_PLUGIN_KEY,
        TODO_ELEMENT_KEY,
        ...noteTypes,
    ],
    defaultType: PARAGRAPH_TYPE,
};

const resetBlockTypePlugin: { options: Partial<ResetNodePlugin> } = {
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
export const defaultPlugins = [
    createDeserializeDocxPlugin(), // depends on juice plugin
    createJuicePlugin(),
    paragraphPlugin(),
    createResetNodePlugin(resetBlockTypePlugin),
    createSoftBreakPlugin(),
    createAutoformatPlugin(),
    createEventEditorPlugin(),
];

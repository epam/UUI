import {
    createPluginFactory, PlatePlugin,
} from '@udecode/plate-common';
import { NotePluginBlock } from './NotePluginBlock';
import { NODE_PLUGIN_KEY, NOTE_ERROR_PLUGIN_KEY, NOTE_ERROR_TYPE, NOTE_LINK_PLUGIN_KEY, NOTE_LINK_TYPE, NOTE_QUOTE_PLUGIN_KEY, NOTE_QUOTE_TYPE, NOTE_WARN_PLUGIN_KEY, NOTE_WARN_TYPE } from './constants';
import { NoteEntryConfig, NoteNodeProps, NotePluginOptions } from './types';
import { NoteButton } from './NoteBar';

const defaultNodes = [
    {
        key: NOTE_ERROR_PLUGIN_KEY,
        type: NOTE_ERROR_TYPE,
        isElement: true,
        isVoid: false,
        component: NotePluginBlock,
    },
    {
        key: NOTE_WARN_PLUGIN_KEY,
        type: NOTE_WARN_TYPE,
        isElement: true,
        isVoid: false,
        component: NotePluginBlock,
    },
    {
        key: NOTE_LINK_PLUGIN_KEY,
        type: NOTE_LINK_TYPE,
        isElement: true,
        isVoid: false,
        component: NotePluginBlock,
    },
    {
        key: NOTE_QUOTE_PLUGIN_KEY,
        type: NOTE_QUOTE_TYPE,
        isElement: true,
        isVoid: false,
        component: NotePluginBlock,
    },
];

const createNote = (config: NoteEntryConfig): PlatePlugin => {
    return {
        key: config.type,
        type: config.type,
        isElement: true,
        isVoid: false,
        component: NotePluginBlock,
        props: () => ({
            nodeProps: {
                borderColor: config.borderColor,
                backgroundColor: config.backgroundColor,
            } as NoteNodeProps,
        }),
    };
};

export const notePlugin = (...notes: NoteEntryConfig[]): PlatePlugin => {
    const createNotePlugin = createPluginFactory<NotePluginOptions>({
        key: NODE_PLUGIN_KEY,
        isElement: true,
        isVoid: false,
        component: NotePluginBlock,
        plugins: !!notes.length ? notes.map((config) => createNote(config)) : defaultNodes,
        options: {
            bottomBarButton: NoteButton,
            notes: !!notes.length ? notes : undefined,
        } as NotePluginOptions,
    });

    return createNotePlugin();
};

import {
    AnyObject,
    createPluginFactory, PlatePlugin,
} from '@udecode/plate-common';
import { NotePluginBlock } from './NotePluginBlock';
import { defaultNotesConfig, NODE_PLUGIN_KEY } from './constants';
import { NoteEntryConfig, NoteNodeProps, NotePluginOptions } from './types';
import { NoteButton } from './NoteBar';

const createPlugin = (config: NoteEntryConfig): PlatePlugin => {
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
                icon: config.icon,
            } as NoteNodeProps,
        }),
    };
};

export const notePlugin = (...userNotes: NoteEntryConfig[]): PlatePlugin => {
    const notes = !!userNotes.length ? userNotes : defaultNotesConfig;
    const createNotePlugin = createPluginFactory<AnyObject>({
        key: NODE_PLUGIN_KEY,
        isElement: true,
        isVoid: false,
        component: NotePluginBlock,
        plugins: notes.map((config) => createPlugin(config)),
        options: {
            bottomBarButton: NoteButton,
            notes,
        } as NotePluginOptions,
    });

    return createNotePlugin();
};

import { Dropdown } from '@epam/uui-components';
import React from 'react';

import { useIsPluginActive } from '../../helpers';

import { NoteBar } from '../../implementation/NoteBar';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as NoteIcon } from '../../icons/info-block-quote.svg';

import {
    PlateEditor, createPluginFactory, getBlockAbove, PlatePlugin,
} from '@udecode/plate-common';
import { NotePluginBlock } from './NotePluginBlock';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { NODE_PLUGIN_KEY, noteTypes, NOTE_ERROR_PLUGIN_KEY, NOTE_ERROR_TYPE, NOTE_LINK_PLUGIN_KEY, NOTE_LINK_TYPE, NOTE_QUOTE_PLUGIN_KEY, NOTE_QUOTE_TYPE, NOTE_WARN_PLUGIN_KEY, NOTE_WARN_TYPE } from './constants';

function Note(props: any) {
    return (
        <NotePluginBlock
            { ...props }
            type={ props.element.type.replace('note-', '') }
        />
    );
}

export const notePlugin = (): PlatePlugin => {
    const createNotePlugin = createPluginFactory<WithToolbarButton>({
        key: NODE_PLUGIN_KEY,
        isElement: true,
        isVoid: false,
        component: Note,
        plugins: [
            {
                key: NOTE_ERROR_PLUGIN_KEY,
                type: NOTE_ERROR_TYPE,
                isElement: true,
                isVoid: false,
                component: Note,
            },
            {
                key: NOTE_WARN_PLUGIN_KEY,
                type: NOTE_WARN_TYPE,
                isElement: true,
                isVoid: false,
                component: Note,
            },
            {
                key: NOTE_LINK_PLUGIN_KEY,
                type: NOTE_LINK_TYPE,
                isElement: true,
                isVoid: false,
                component: Note,
            },
            {
                key: NOTE_QUOTE_PLUGIN_KEY,
                type: NOTE_QUOTE_TYPE,
                isElement: true,
                isVoid: false,
                component: Note,
            },
        ],
        options: {
            bottomBarButton: NoteButton,
        },
    });
    return createNotePlugin();
};

interface IToolbarNote {
    editor: PlateEditor;
}

export function NoteButton({ editor }: IToolbarNote) {
    if (!useIsPluginActive(NODE_PLUGIN_KEY)) return null;

    const block = getBlockAbove(editor, { block: true });
    const type: any = block?.length && block[0].type;

    return (
        <Dropdown
            renderTarget={ (props) => (
                <ToolbarButton
                    isActive={ noteTypes.includes(type) }
                    icon={ NoteIcon }
                    { ...props }
                />
            ) }
            renderBody={ (props) => (
                <NoteBar
                    editor={ editor }
                    type={ type }
                    { ...props }
                />
            ) }
            placement="top-start"
            modifiers={ [{
                name: 'offset',
                options: { offset: [0, 3] },
            }] }
        />
    );
}

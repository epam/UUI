import { Dropdown } from '@epam/uui-components';
import React from 'react';

import { useIsPluginActive } from '../../helpers';

import { NoteBar } from '../../implementation/NoteBar';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as NoteIcon } from '../../icons/info-block-quote.svg';

import {
    PlateEditor, createPluginFactory, getBlockAbove,
} from '@udecode/plate-common';
import { NotePluginBlock } from './NotePluginBlock';
import { WithToolbarButton } from '../../implementation/Toolbars';

export const noteTypes = ['note-error', 'note-warning', 'note-link', 'note-quote'];

function Note(props: any) {
    return (
        <NotePluginBlock
            { ...props }
            type={ props.element.type.replace('note-', '') }
        />
    );
}

export const notePlugin = () => {
    const createNotePlugin = createPluginFactory<WithToolbarButton>({
        key: 'note',
        isElement: true,
        isVoid: false,
        component: Note,
        plugins: [
            {
                key: 'note-error',
                type: 'note-error',
                isElement: true,
                isVoid: false,
                component: Note,
            },
            {
                key: 'note-warning',
                type: 'note-warning',
                isElement: true,
                isVoid: false,
                component: Note,
            },
            {
                key: 'note-link',
                type: 'note-link',
                isElement: true,
                isVoid: false,
                component: Note,
            },
            {
                key: 'note-quote',
                type: 'note-quote',
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
    if (!useIsPluginActive('note')) return null;

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

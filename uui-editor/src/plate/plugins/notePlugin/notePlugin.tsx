import React from 'react';
import { Dropdown } from '@epam/uui-components';

import {
    createPluginFactory,
    getBlockAbove,
    PlateEditor,
    ToolbarButton as PlateToolbarButton,
    insertText
} from '@udecode/plate';

import { isPluginActive } from '../../../helpers';

import { ToolbarButton } from '../../implementation/ToolbarButton';
import { NoteBar } from '../../../implementation/NoteBar';

import { ReactComponent as NoteIcon } from '../../../icons/info-block-quote.svg';

import { NotePluginBlock } from './NotePluginBlock';

const noteBlocks = ['note-error', 'note-warning', 'note-link', 'note-quote'];

const Note = (props: any) => {
    return <NotePluginBlock
        { ...props }
        type={ props.element.type.replace('note-', '') }
    />;
};

export const notePlugin = () => {
    const createNotePlugin = createPluginFactory({
        key: 'note',
        isElement: true,
        isVoid: false,
        component: Note,
        handlers: {
            // TODO: potential handler improvement by https://github.com/ianstormtaylor/slate/issues/97
            onKeyDown: (editor) => (event) => {
                if (event.key === 'Enter') {
                    // do not prevent default behavior right here, it leads to bugs with insertData plugin

                    const noteEntry = getBlockAbove(editor, {
                        match: { type: ['note-link', 'note-error', 'note-warning', 'note-quote'] },
                    });
                    if(noteEntry) {
                        event.preventDefault();
                        insertText(editor, '\n');
                        return true;
                    }
                }
            },
        },
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
    });
    return createNotePlugin();
};

interface IToolbarNote {
    editor: PlateEditor;
}

export const NoteButton = ({ editor }: IToolbarNote) => {

    if (!isPluginActive('note')) return null;

    const block = getBlockAbove(editor, { block: true });
    const type: any = block?.length && block[0].type;

    return (
        <Dropdown
            renderTarget={ (props) => (
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ noteBlocks.includes(type) }
                        icon={ NoteIcon }
                        { ...props }
                    /> }
                />
            ) }
            renderBody={ (props) => <NoteBar editor={ editor } type={ type } { ...props } /> }
            placement='top-start'
            modifiers={ [{ name: 'offset', options: { offset: [0, 3] } }] }
        />
    );
};
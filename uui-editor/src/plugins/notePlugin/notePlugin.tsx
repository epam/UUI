import { Editor, RenderBlockProps } from "slate-react";
import { Editor as CoreEditor, Block, KeyUtils } from "slate";
import * as React from "react";
import { NotePluginBlock } from "./NotePluginBlock";
import { Dropdown } from "@epam/uui-components";
import * as noteIcon from "../../icons/info-block-quote.svg";
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { NoteBar } from '../../implementation/NoteBar';

export const noteBlocks = ['note-error', 'note-warning', 'note-link', 'note-quote'];

export const notePlugin = () => {
    const renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
        switch (props.node.type) {
            case 'note-error':
                return <NotePluginBlock { ...props } type='error'/>;
            case 'note-warning':
                return <NotePluginBlock { ...props } type='warning'/>;
            case 'note-link':
                return <NotePluginBlock { ...props } type='link'/>;
            case 'note-quote':
                return <NotePluginBlock { ...props } type='quote'/>;
            default:
                return next();
        }
    };

    const addNote = (editor: CoreEditor) => {
        const emptyParagraph = Block.create({
            object: 'block',
            type: 'paragraph',
            key: KeyUtils.create(),
        });
        editor.insertBlock(emptyParagraph).moveToEndOfPreviousBlock().wrapBlock('note');
    };

    const isNote = (editor: CoreEditor) => {
        let noteTypes = ['note-error', 'note-warning', 'note-link', 'note-quote'];
        return noteTypes.some(type => (editor.value.document.getParent(editor.value.blocks.first().key) as any).type == type);
    };

    const isEmpty = (editor: CoreEditor) => {
        return (editor.value.document.getParent(editor.value.blocks.first().key) as any).nodes.size == 1 && editor.value.anchorBlock.text === '';
    };

    const onKeyDown = (event: KeyboardEvent, editor: CoreEditor, next: () => any) => {
        if (event.key === 'Backspace' && (editor as any).hasBlock(noteBlocks) && isEmpty(editor)) {
            return editor.unwrapBlock('note');
        }


        if (event.keyCode == 13 && (editor as any).hasBlock(noteBlocks)) {
            return (editor as any).insertEmptyBlock(editor);
        }

        next();
    };

    return {
        renderBlock,
        onKeyDown,
        queries: {
            addNote,
            isNote,
        },
        sidebarButtons: [ToolbarNoteButton],
    };
};

const ToolbarNoteButton = (editorProps: { editor: any }) => {
    return <Dropdown
        renderTarget={ (props) => <ToolbarButton
            icon={ noteIcon }
            isActive={ editorProps.editor.hasBlock(noteBlocks) }
            onClick={ () => null }
            { ...props }
        /> }
        renderBody={ (props) => <NoteBar editor={ editorProps.editor } { ...props } /> }
        placement='top-start'
        modifiers={ { offset: { offset: '0 3px' } } }
    />;
};

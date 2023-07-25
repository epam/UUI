import React from 'react';
import { useEventPlateId, usePlateEditorRef, usePlateEditorState, isEditorFocused } from '@udecode/plate-common';

import { BoldButton, ItalicButton, UnderlineButton } from './baseMarksPlugin/baseMarksPlugin';
import { CodeButton } from './codeBlockPlugin/codeBlockPlugin';
import { SuperscriptButton } from './superscriptPlugin/superscriptPlugin';
import { ListButton } from './listPlugin/listPlugin';
import { ToDoListButton } from './toDoListPlugin/toDoListPlugin';

import { ColorButton } from './colorPlugin/colorPlugin';
import { LinkButton } from './linkPlugin/linkPlugin';

import { StickyToolbar } from '../implementation/StickyToolbar';
import { HeaderButton } from './headerPlugin/headerPlugin';
import { ImageButton } from './imagePlugin/imagePlugin';
import { NoteButton } from './notePlugin/notePlugin';
import { QuoteButton } from './quotePlugin/quotePlugin';
import { SeparatorButton } from './separatorPlugin/separatorPlugin';
import { PlaceholderButton } from './placeholderPlugin/placeholderPlugin';
import { IframeButton } from './iframePlugin/iframePlugin';
import { VideoButton } from './videoPlugin/videoPlugin';
import { TableButton } from './tablePlugin/tablePlugin';
import { AttachFileButton } from './attachmentPlugin/AttachFileButton';
import { PositionedToolbar } from '../implementation/PositionedToolbar';

export function MarksToolbar() {
    const editorRef = usePlateEditorRef();

    return (
        <PositionedToolbar isImage={ false } editor={ editorRef } plugins={ [] }>
            <BoldButton editor={ editorRef } />
            <ItalicButton editor={ editorRef } />
            <UnderlineButton editor={ editorRef } />
            <ColorButton editor={ editorRef } />
            <SuperscriptButton editor={ editorRef } />
            <LinkButton editor={ editorRef } />
            <CodeButton editor={ editorRef } />
        </PositionedToolbar>
    );
}

export function MainToolbar() {
    const editor = usePlateEditorState(useEventPlateId());
    const isActive = isEditorFocused(editor);

    if (!isActive) {
        return null;
    }

    return (
        <StickyToolbar isReadonly={ false }>
            <HeaderButton editor={ editor } />

            {/* list */}
            <ListButton editor={ editor } />
            <ToDoListButton editor={ editor } />

            {/* block */}
            <QuoteButton editor={ editor } />
            <NoteButton editor={ editor } />
            <AttachFileButton editor={ editor } />
            <ImageButton editor={ editor } />
            <VideoButton editor={ editor } />
            <IframeButton editor={ editor } />
            <SeparatorButton editor={ editor } />
            <TableButton editor={ editor } />
            <PlaceholderButton editor={ editor } />
        </StickyToolbar>
    );
}

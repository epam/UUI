import React from 'react';

import {
    useEventPlateId,
    usePlateEditorState,
    usePlateEditorRef,
    isEditorFocused,
} from '@udecode/plate';

import { BoldButton, ItalicButton, UnderlineButton } from './baseMarksPlugin/baseMarksPlugin';
import { CodeButton } from './codeBlockPlugin/codeBlockPlugin';
import { SuperscriptButton } from './superscriptPlugin/superscriptPlugin';
import { ListButton } from './listPlugin/listPlugin';
import { ToDoListButton } from './toDoListPlugin/toDoListPlugin';

import { ColorButton } from './colorPlugin/colorPlugin';
import { LinkButton } from "./linkPlugin/linkPlugin";

import { Toolbar } from "../implementation/Toolbar";
import { Sidebar } from "../implementation/Sidebar";
import { HeaderButton } from "./headerPlugin/headerPlugin";
import { ImageButton } from "./imagePlugin/imagePlugin";
import { NoteButton } from "./notePlugin/notePlugin";
import { QuoteButton } from "./quotePlugin/quotePlugin";
import { SeparatorButton } from "./separatorPlugin/separatorPlugin";
import { PlaceholderButton } from "./placeholderPlugin/placeholderPlugin";
import { IframeButton } from "./iframePlugin/iframePlugin";
import { VideoButton } from "./videoPlugin/videoPlugin";
import { TableButton } from "./tablePlugin/tablePlugin";
import { AttachFileButton } from './attachmentPlugin/AttachFileButton';


export const MarkBalloonToolbar = () => {
    const editorRef = usePlateEditorRef();

    return (
        <Toolbar isImage={ false } editor={ editorRef } plugins={ [] }>
            <BoldButton editor={ editorRef } />
            <ItalicButton editor={ editorRef } />
            <UnderlineButton editor={ editorRef } />
            <ColorButton editor={ editorRef }/>
            <SuperscriptButton editor={ editorRef } />
            <LinkButton editor={ editorRef }/>
            <CodeButton editor={ editorRef } />
        </Toolbar>
    );
};

export const ListToolbarButtons = () => {
    const editor = usePlateEditorState(useEventPlateId());

    return (
        <>
            <ListButton editor={ editor } />
            <ToDoListButton editor={ editor }/>
        </>
    );
};

const BlockToolbarButtons = () => {
    const editorRef = usePlateEditorRef(useEventPlateId());

    return (
        <>
            <QuoteButton editor={ editorRef } />
            <NoteButton editor={ editorRef } />
            <AttachFileButton editor={ editorRef }/>
            <ImageButton editor={ editorRef }/>
            <VideoButton editor={ editorRef } />
            <IframeButton editor={ editorRef } />
            <SeparatorButton editor={ editorRef } />
            <TableButton editor={ editorRef } />
            <PlaceholderButton editor={ editorRef } />
        </>
    );
};

export const ToolbarButtons = () => {
    const editor = usePlateEditorState(useEventPlateId());
    const isActive = isEditorFocused(editor);

    if (!isActive) {
        return null;
    }

    return (
        <Sidebar isReadonly={ false } >
            <HeaderButton editor={ editor }/>
            <ListToolbarButtons />
            <BlockToolbarButtons />
        </Sidebar>
    );
};

import { EditorState, DraftInlineStyleType, DraftBlockType, ContentState } from 'draft-js';
import { Icon, IEditable, IHasChildren } from '@epam/uui-core';
import React from 'react';

export interface DraftButtonProps  extends IEditable<EditorState> {}

export interface DraftInlineStyleButton {
    style: DraftInlineStyleType;
    icon?: Icon;
    caption?: string;
}

export interface DraftBlockStyleButton {
    blockType: DraftBlockType;
    icon?: Icon;
    caption?: string;
}

export interface DecoratorComponentProps extends IHasChildren {
    entityKey?: string;
    data?: Record<string, string>;
    offsetKey?: string;
    decoratedText?: string;
    contentState?: ContentState;
}

export type ToolbarButton = 'bold' | 'italic' | 'underline' | 'header' | 'header-dropdown' | 'unordered-list' | 'ordered-list' | 'link' | 'image' | 'undo' | 'redo' | 'separator' | 'clear-format';

export type ToolbarTextColor = 'sky' | 'grass' | 'carbon' | 'night' | 'cobalt' | 'lavanda' | 'fuchsia' | 'fire' | 'sun';

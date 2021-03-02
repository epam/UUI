import { EditorState, RichUtils } from 'draft-js';
import clearFormatting from 'draft-js-clear-formatting';
import { IconButton } from '@epam/loveship';
import * as React from 'react';
import * as boldIcon from '../../../icons/bold.svg';
import * as italicIcon from '../../../icons/italic.svg';
import * as underlineIcon from '../../../icons/underline.svg';
import * as headerIcon from '../../../icons/headline.svg';
import * as orderedListIcon from '../../../icons/list_numbered.svg';
import * as unorderedListIcon from '../../../icons/list_bulleted.svg';
import * as redoArrowIcon from '../../../icons/redo.svg';
import * as undoArrowIcon from '../../../icons/undo.svg';
import * as clearFormatIcon from '../../../icons/clear_format.svg';
import { createInlineStyleLinkButton, createBlockStyleLinkButton } from '../../../utils';

export const BoldButton = createInlineStyleLinkButton({ style: 'BOLD', icon: boldIcon });
export const ItalicButton = createInlineStyleLinkButton({ style: 'ITALIC', icon: italicIcon });
export const UnderlineButton = createInlineStyleLinkButton({ style: 'UNDERLINE', icon: underlineIcon });
export const HeadlineOneButton = createBlockStyleLinkButton({ blockType: 'header-three', icon: headerIcon });
export const OrderedListButton = createBlockStyleLinkButton({ blockType: 'ordered-list-item', icon: orderedListIcon });
export const UnorderedListButton = createBlockStyleLinkButton({ blockType: 'unordered-list-item', icon: unorderedListIcon });

export const UndoButton = (props: any) => (
    <div
        onMouseDown={ (event: React.MouseEvent<HTMLDivElement>) => { event.preventDefault(); } }
    >
        <IconButton
            icon={ undoArrowIcon }
            color='night600'
            onClick={ (event: any) => { props.onValueChange(EditorState.undo(props.value)); } }
            isDisabled={ props.value.getUndoStack().isEmpty() }
        />
    </div>
);

export const RedoButton = (props: any) => (
    <div
        onMouseDown={ (event: React.MouseEvent<HTMLDivElement>) => { event.preventDefault(); } }
    >
        <IconButton
            icon={ redoArrowIcon }
            color='night600'
            onClick={ (event: any) => { props.onValueChange(EditorState.redo(props.value)); } }
            isDisabled={ props.value.getRedoStack().isEmpty() }
        />
    </div>
);

export const ClearFormatButton = (props: any) => (
    <div onMouseDown={ (event: React.MouseEvent<HTMLDivElement>) => { event.preventDefault(); } }>
        <IconButton
            icon={ clearFormatIcon }
            onClick={ (event: any) => { props.onValueChange(clearFormatting(RichUtils.toggleBlockType(props.value, 'unstyled'))); } }
            color='night600'
        />
    </div>
);


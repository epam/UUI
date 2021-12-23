import { EditorState, RichUtils } from 'draft-js';
import clearFormatting from 'draft-js-clear-formatting';
import { IconButton } from '@epam/loveship';
import * as React from 'react';
import { ReactComponent as BoldIcon } from '../../../icons/bold.svg';
import { ReactComponent as ItalicIcon } from '../../../icons/italic.svg';
import { ReactComponent as UnderlineIcon } from '../../../icons/underline.svg';
import { ReactComponent as HeaderIcon } from '../../../icons/headline.svg';
import { ReactComponent as OrderedListIcon } from '../../../icons/list_numbered.svg';
import { ReactComponent as UnorderedListIcon } from '../../../icons/list_bulleted.svg';
import { ReactComponent as RedoArrowIcon } from '../../../icons/redo.svg';
import { ReactComponent as UndoArrowIcon } from '../../../icons/undo.svg';
import { ReactComponent as ClearFormatIcon } from '../../../icons/clear_format.svg';
import { createInlineStyleLinkButton, createBlockStyleLinkButton } from '../../../utils';

export const BoldButton = createInlineStyleLinkButton({ style: 'BOLD', icon: BoldIcon });
export const ItalicButton = createInlineStyleLinkButton({ style: 'ITALIC', icon: ItalicIcon });
export const UnderlineButton = createInlineStyleLinkButton({ style: 'UNDERLINE', icon: UnderlineIcon });
export const HeadlineOneButton = createBlockStyleLinkButton({ blockType: 'header-three', icon: HeaderIcon });
export const OrderedListButton = createBlockStyleLinkButton({ blockType: 'ordered-list-item', icon: OrderedListIcon });
export const UnorderedListButton = createBlockStyleLinkButton({ blockType: 'unordered-list-item', icon: UnorderedListIcon });

export const UndoButton = (props: any) => (
    <div
        onMouseDown={ (event: React.MouseEvent<HTMLDivElement>) => { event.preventDefault(); } }
    >
        <IconButton
            icon={ UndoArrowIcon }
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
            icon={ RedoArrowIcon }
            color='night600'
            onClick={ (event: any) => { props.onValueChange(EditorState.redo(props.value)); } }
            isDisabled={ props.value.getRedoStack().isEmpty() }
        />
    </div>
);

export const ClearFormatButton = (props: any) => (
    <div onMouseDown={ (event: React.MouseEvent<HTMLDivElement>) => { event.preventDefault(); } }>
        <IconButton
            icon={ ClearFormatIcon }
            onClick={ (event: any) => { props.onValueChange(clearFormatting(RichUtils.toggleBlockType(props.value, 'unstyled'))); } }
            color='night600'
        />
    </div>
);


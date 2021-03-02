import { BoldButton, ItalicButton, UnderlineButton, HeadlineOneButton, UnorderedListButton, OrderedListButton, UndoButton, RedoButton, ClearFormatButton } from './CommonButtons';
import { LinkButton } from './LinkButton';
import { HeaderDropDownButton } from './HeaderDropdownButton';
import { ImageButton } from './ImageButton';
import { Separator } from '../Separator';
import { ToolbarButton } from '../../../types';

export * from './CommonButtons';
export * from './LinkButton';

export const buttonsMap: Record<ToolbarButton, any> = {
    'bold': BoldButton,
    'italic': ItalicButton,
    'underline': UnderlineButton,
    'header': HeadlineOneButton,
    'unordered-list': UnorderedListButton,
    'ordered-list': OrderedListButton,
    'link': LinkButton,
    'image': ImageButton,
    'undo': UndoButton,
    'redo': RedoButton,
    'separator': Separator,
    'clear-format': ClearFormatButton,
    'header-dropdown': HeaderDropDownButton,
};

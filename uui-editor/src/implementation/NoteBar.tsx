import * as React from 'react';

import { DropdownBodyProps, uuiSkin } from '@epam/uui-core';
import { PlateEditor, setElements } from '@udecode/plate-common';

import { ReactComponent as NoteIconLink } from '../icons/info-block-link.svg';
import { ReactComponent as NoteIconQuote } from '../icons/info-block-quote.svg';
import { ReactComponent as NoteIconError } from '../icons/info-block-warning.svg';
import { ReactComponent as NoteIconWarning } from '../icons/info-block.svg';
import { ReactComponent as ClearIcon } from '../icons/text-color-default.svg';

import { ToolbarButton } from './ToolbarButton';

const { FlexRow } = uuiSkin;

interface NoteBarProps extends DropdownBodyProps {
    editor: PlateEditor;
    type?: string;
}

export function NoteBar({ editor, type }: NoteBarProps) {
    const prevElementType = React.useRef(type);

    const toggleBlock = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, toggleType: string) => {
        // fixes a bug with toolbar removal
        e.preventDefault();

        let newType = toggleType;
        if (type === prevElementType.current) {
            newType = 'paragraph';
        }
        prevElementType.current = newType;

        setElements(editor, { type: newType, children: [{ text: '' }] });
    };

    const clearBlock = () => {
        setElements(editor, { type: 'paragraph' });
    };

    return (
        <FlexRow rawProps={ { style: { background: '#303240' } } }>
            <ToolbarButton
                onClick={ clearBlock }
                icon={ ClearIcon }
                iconColor="gray60"
            />
            <ToolbarButton
                isActive={ type === 'note-quote' }
                onClick={ (e) => toggleBlock(e, 'note-quote') }
                icon={ NoteIconQuote }
                iconColor="gray60"
            />
            <ToolbarButton
                isActive={ type === 'note-error' }
                onClick={ (e) => toggleBlock(e, 'note-error') }
                icon={ NoteIconError }
                iconColor="red"
            />
            <ToolbarButton
                isActive={ type === 'note-warning' }
                onClick={ (e) => toggleBlock(e, 'note-warning') }
                icon={ NoteIconWarning }
                iconColor="amber"
            />
            <ToolbarButton
                isActive={ type === 'note-link' }
                onClick={ (e) => toggleBlock(e, 'note-link') }
                icon={ NoteIconLink }
                iconColor="blue"
            />
        </FlexRow>
    );
}

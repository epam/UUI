import * as React from 'react';
import { PlateEditor, setElements } from '@udecode/plate-common';
import { DropdownBodyProps } from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { ToolbarButton } from './ToolbarButton';

import { ReactComponent as NoteIconLink } from '../icons/info-block-link.svg';
import { ReactComponent as NoteIconQuote } from '../icons/info-block-quote.svg';
import { ReactComponent as NoteIconError } from '../icons/info-block-warning.svg';
import { ReactComponent as NoteIconWarning } from '../icons/info-block.svg';
import { ReactComponent as ClearIcon } from '../icons/text-color-default.svg';

import css from './NoteBar.module.scss';
import { NOTE_ERROR_TYPE, NOTE_LINK_TYPE, NOTE_QUOTE_TYPE, NOTE_WARN_TYPE } from '../plugins/notePlugin/constants';
import { PARAGRAPH_TYPE } from '../plugins/paragraphPlugin/constants';

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
        if (newType === prevElementType.current) {
            newType = PARAGRAPH_TYPE;
        }
        prevElementType.current = newType;

        setElements(editor, { type: newType, children: [{ text: '' }] });
    };

    const clearBlock = () => {
        setElements(editor, { type: PARAGRAPH_TYPE });
    };

    return (
        <FlexRow cx={ css.wrapper }>
            <ToolbarButton
                onClick={ clearBlock }
                icon={ ClearIcon }
                iconColor="gray60"
            />
            <ToolbarButton
                isActive={ type === NOTE_QUOTE_TYPE }
                onClick={ (e) => toggleBlock(e, NOTE_QUOTE_TYPE) }
                icon={ NoteIconQuote }
                iconColor="gray60"
            />
            <ToolbarButton
                isActive={ type === NOTE_ERROR_TYPE }
                onClick={ (e) => toggleBlock(e, NOTE_ERROR_TYPE) }
                icon={ NoteIconError }
                iconColor="red"
            />
            <ToolbarButton
                isActive={ type === NOTE_WARN_TYPE }
                onClick={ (e) => toggleBlock(e, NOTE_WARN_TYPE) }
                icon={ NoteIconWarning }
                iconColor="amber"
            />
            <ToolbarButton
                isActive={ type === NOTE_LINK_TYPE }
                onClick={ (e) => toggleBlock(e, NOTE_LINK_TYPE) }
                icon={ NoteIconLink }
                iconColor="blue"
            />
        </FlexRow>
    );
}

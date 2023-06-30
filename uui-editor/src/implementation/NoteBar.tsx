import * as React from 'react';

import { DropdownBodyProps, uuiSkin } from "@epam/uui-core";

import {
    PlateEditor,
    setElements,
    ToolbarButton as PlateToolbarButton,
} from '@udecode/plate';

import { ReactComponent as ClearIcon } from "../icons/text-color-default.svg";
import { ReactComponent as NoteIconError } from "../icons/info-block-warning.svg";
import { ReactComponent as NoteIconWarning } from "../icons/info-block.svg";
import { ReactComponent as NoteIconLink } from "../icons/info-block-link.svg";
import { ReactComponent as NoteIconQuote } from "../icons/info-block-quote.svg";

import { ToolbarButton } from './ToolbarButton';

const { FlexRow } = uuiSkin;

const noop = () => {};

interface NoteBarProps extends DropdownBodyProps {
    editor: PlateEditor;
    type?: string;
}

export function NoteBar({ editor, type }: NoteBarProps) {
    const prevElementType = React.useRef(type);

    const toggleBlock = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        // fixes a bug with toolbar removal
        e.preventDefault();

        let newType = type;
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
            <PlateToolbarButton
                key='default'
                styles={ { root: { width: 'auto', cursor: 'pointer', minHeight: '42px', padding: 0 } } }
                icon={ <ToolbarButton
                    onClick={ noop }
                    icon={ ClearIcon }
                    iconColor='gray60'
                /> }
                onMouseDown={ clearBlock }
            />
            <PlateToolbarButton
                key='note-quote'
                styles={ { root: { width: 'auto', cursor: 'pointer', minHeight: '42px', padding: 0 } } }
                icon={ <ToolbarButton
                    isActive={ type === 'note-quote' }
                    onClick={ noop }
                    icon={ NoteIconQuote }
                    iconColor='gray60'
                /> }
                onMouseDown={ (e) => toggleBlock(e, 'note-quote') }
            />
            <PlateToolbarButton
                key='note-error'
                styles={ { root: { width: 'auto', cursor: 'pointer', minHeight: '42px', padding: 0 } } }
                icon={ <ToolbarButton
                    isActive={ type === 'note-error' }
                    onClick={ noop }
                    icon={ NoteIconError }
                    iconColor='red'
                /> }
                onMouseDown={ (e) => toggleBlock(e, 'note-error') }
            />
            <PlateToolbarButton
                key='note-warning'
                styles={ { root: { width: 'auto', cursor: 'pointer', minHeight: '42px', padding: 0 } } }
                icon={ <ToolbarButton
                    isActive={ type === 'note-warning' }
                    onClick={ noop }
                    icon={ NoteIconWarning }
                    iconColor='amber'
                /> }
                onMouseDown={ (e) => toggleBlock(e, 'note-warning') }
            />
            <PlateToolbarButton
                key='note-link'
                styles={ { root: { width: 'auto', cursor: 'pointer', minHeight: '42px', padding: 0 } } }
                icon={ <ToolbarButton
                    isActive={ type === 'note-link' }
                    onClick={ noop }
                    icon={ NoteIconLink }
                    iconColor='blue'
                /> }
                onMouseDown={ (e) => toggleBlock(e, 'note-link') }
            />
        </FlexRow>
    );
}
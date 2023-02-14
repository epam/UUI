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

    const toggleBlock = (type: string) => {
        setElements(editor, { type, children: [{ text: '' }] });
    };

    const clearBlock = () => {
        setElements(editor, { type: 'paragraph' });
    };

    return (
        <FlexRow rawProps={ { style: { background: '#303240' } } }>
            <PlateToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                icon={ <ToolbarButton
                    onClick={ noop }
                    icon={ ClearIcon }
                    iconColor='gray60'
                /> }
                onMouseDown={ clearBlock }
            />
            <PlateToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                icon={ <ToolbarButton
                    isActive={ type === 'note-quote' }
                    onClick={ noop }
                    icon={ NoteIconQuote }
                    iconColor='gray60'
                /> }
                onMouseDown={ () => toggleBlock('note-quote') }
            />
            <PlateToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                icon={ <ToolbarButton
                    isActive={ type === 'note-error' }
                    onClick={ noop }
                    icon={ NoteIconError }
                    iconColor='red'
                /> }
                onMouseDown={ () => toggleBlock('note-error') }
            />
            <PlateToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                icon={ <ToolbarButton
                    isActive={ type === 'note-warning' }
                    onClick={ noop }
                    icon={ NoteIconWarning }
                    iconColor='amber'
                /> }
                onMouseDown={ () => toggleBlock('note-warning') }
            />
            <PlateToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                icon={ <ToolbarButton
                    isActive={ type === 'note-link' }
                    onClick={ noop }
                    icon={ NoteIconLink }
                    iconColor='blue'
                /> }
                onMouseDown={ () => toggleBlock('note-link') }
            />
        </FlexRow>
    );
}
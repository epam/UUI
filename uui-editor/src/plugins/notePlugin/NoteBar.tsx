import * as React from 'react';
import { PlateEditor, getBlockAbove, getPluginOptions, setElements, useEditorRef } from '@udecode/plate-common';
import { DropdownBodyProps } from '@epam/uui-core';
import { Dropdown } from '@epam/uui';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as NoteIconLink } from '../../icons/info-block-link.svg';
import { ReactComponent as NoteIconQuote } from '../../icons/info-block-quote.svg';
import { ReactComponent as NoteIconError } from '../../icons/info-block-warning.svg';
import { ReactComponent as NoteIconWarning } from '../../icons/info-block.svg';
import { ReactComponent as ClearIcon } from '../../icons/text-color-default.svg';
import { ReactComponent as NoteIcon } from '../../icons/info-block-quote.svg';

import css from './NoteBar.module.scss';
import { NODE_PLUGIN_KEY, NOTE_ERROR_TYPE, NOTE_LINK_TYPE, NOTE_QUOTE_TYPE, NOTE_WARN_TYPE, noteTypes } from './constants';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/constants';
import { useIsPluginActive } from '../../helpers';
import { NotePluginOptions } from './types';

interface NoteBarProps extends DropdownBodyProps {
    editor: PlateEditor;
    type: string;
}

export function NoteBar({ editor, type: currentType }: NoteBarProps) {
    const editorRef = useEditorRef();

    const { notes: userNotes } = React.useMemo(() => getPluginOptions<NotePluginOptions>(
        editorRef,
        NODE_PLUGIN_KEY,
    ), [editorRef]);

    const toggleBlock = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, toggleType: string) => {
        // fixes a bug with toolbar removal
        e.preventDefault();

        let newType = toggleType;
        if (newType === currentType) {
            newType = PARAGRAPH_TYPE;
        }

        setElements(editor, { type: newType, children: [{ text: '' }] });
    };

    const clearBlock = () => {
        setElements(editor, { type: PARAGRAPH_TYPE });
    };

    const defaultNoteButtons = (
        <React.Fragment>
            <ToolbarButton
                key="quote"
                isActive={ currentType === NOTE_QUOTE_TYPE }
                onClick={ (e) => toggleBlock(e, NOTE_QUOTE_TYPE) }
                icon={ NoteIconQuote }
                iconColor="gray60"
            />
            <ToolbarButton
                key="error"
                isActive={ currentType === NOTE_ERROR_TYPE }
                onClick={ (e) => toggleBlock(e, NOTE_ERROR_TYPE) }
                icon={ NoteIconError }
                iconColor="red"
            />
            <ToolbarButton
                key="warn"
                isActive={ currentType === NOTE_WARN_TYPE }
                onClick={ (e) => toggleBlock(e, NOTE_WARN_TYPE) }
                icon={ NoteIconWarning }
                iconColor="amber"
            />
            <ToolbarButton
                key="link"
                isActive={ currentType === NOTE_LINK_TYPE }
                onClick={ (e) => toggleBlock(e, NOTE_LINK_TYPE) }
                icon={ NoteIconLink }
                iconColor="blue"
            />
        </React.Fragment>
    );

    const notes = userNotes ? userNotes.map(({ type, backgroundColor }) => {
        return (
            <ToolbarButton
                key={ type }
                isActive={ currentType === type }
                onClick={ (e) => toggleBlock(e, type) }
                icon={ () => {
                    return (
                        <div className={ css.iconWrapper } style={ { backgroundColor } }>
                            <span>A</span>
                        </div>
                    );
                } }
                cx={ css.noteButton }
            />
        );
    }) : defaultNoteButtons;

    return (
        <div className={ css.wrapper }>
            <ToolbarButton
                key="clear"
                onClick={ clearBlock }
                icon={ ClearIcon }
                iconColor="gray60"
            />
            {notes}
        </div>
    );
}

interface IToolbarNote {
    editor: PlateEditor;
}

export function NoteButton({ editor }: IToolbarNote) {
    if (!useIsPluginActive(NODE_PLUGIN_KEY)) return null;

    const block = getBlockAbove(editor, { block: true });
    const type: any = block?.length && block[0].type;

    return (
        <Dropdown
            renderTarget={ (props) => (
                <ToolbarButton
                    isActive={ noteTypes.includes(type) }
                    icon={ NoteIcon }
                    { ...props }
                />
            ) }
            renderBody={ (props) => (
                <NoteBar
                    editor={ editor }
                    type={ type }
                    { ...props }
                />
            ) }
            placement="top-start"
            modifiers={ [{
                name: 'offset',
                options: { offset: [0, 3] },
            }] }
        />
    );
}

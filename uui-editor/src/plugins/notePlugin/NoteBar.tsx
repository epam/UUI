import * as React from 'react';
import { offset } from '@floating-ui/react';
import { PlateEditor, getBlockAbove, getPluginOptions, setElements, useEditorRef } from '@udecode/plate-common';
import { DropdownBodyProps } from '@epam/uui-core';
import { Dropdown } from '@epam/uui';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as ClearIcon } from '../../icons/text-color-default.svg';
import { ReactComponent as NoteIcon } from '../../icons/info-block-quote.svg';

import css from './NoteBar.module.scss';
import { NODE_PLUGIN_KEY, noteTypes } from './constants';
import { PARAGRAPH_TYPE } from '../paragraphPlugin';
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

    const notes = userNotes.map(({ type, toolbarIcon }) => {
        return (
            <ToolbarButton
                key={ type }
                isActive={ currentType === type }
                onClick={ (e) => toggleBlock(e, type) }
                icon={ toolbarIcon }
                cx={ css.noteButton }
            />
        );
    });

    return (
        <div className={ css.wrapper }>
            <ToolbarButton
                key="clear"
                onClick={ clearBlock }
                icon={ ClearIcon }
                rawProps={ { style: { fill: '#6C6F80' } } }
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
            middleware={ [offset(3)] }
        />
    );
}

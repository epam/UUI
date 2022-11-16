import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
    focusEditor,
    getMark,
    getPluginType,
    isMarkActive,
    removeMark,
    select,
    setMarks,
    useEventPlateId,
    usePlateEditorRef,
    usePlateEditorState,
    ToolbarButton,
    ToolbarButtonProps,
    getPreventDefaultHandler,
    toggleMark,
    ToolbarDropdown,
} from '@udecode/plate';

import { ColorBar } from '../implementation/ColorBar';

export const ColorPickerToolbarDropdown = ({
   id,
   pluginKey,
   icon,
   colors = [],
   customColors = [],
   closeOnSelect = false,
   ...rest
}: ToolbarButtonProps) => {
    id = useEventPlateId(id);
    const editor = usePlateEditorState(id);
    const editorRef = usePlateEditorRef(id);

    const [open, setOpen] = useState(false);

    const type = getPluginType(editorRef, pluginKey);

    const color = editorRef && getMark(editorRef, type);

    const [selectedColor, setSelectedColor] = useState<string>();

    const onToggle = useCallback(() => {
        setOpen(!open);
    }, [open, setOpen]);

    const updateColor = useCallback(
        (value: string) => {
            if (editorRef && editor && editor.selection) {

                setSelectedColor(value);

                select(editorRef, editor.selection);
                focusEditor(editorRef);

                setMarks(editor, { [type]: value });
            }
        },
        [editor, editorRef, type],
    );

    const updateColorAndClose = useCallback(
        (value: string) => {
            updateColor(value);
            closeOnSelect && onToggle();
        },
        [closeOnSelect, onToggle, updateColor],
    );

    const clearColor = useCallback(() => {
        if (editorRef && editor && editor.selection) {
            select(editorRef, editor.selection);
            focusEditor(editorRef);

            if (selectedColor) {
                removeMark(editor, { key: type });
            }

            closeOnSelect && onToggle();
        }
    }, [closeOnSelect, editor, editorRef, onToggle, selectedColor, type]);

    useEffect(() => {
        if (editor?.selection) {
            setSelectedColor(color);
        }
    }, [color, editor?.selection]);

    return (
        <ToolbarDropdown
            control={
                <ToolbarButton
                    styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                    active={ !!editor?.selection && isMarkActive(editor, type) }
                    icon={ icon }
                    onMouseDown={
                        editor
                            ? getPreventDefaultHandler(toggleMark, editor, { key: type })
                            : undefined
                    }
                    { ...rest }
                />
            }
            open={ open }
            onOpen={ onToggle }
            onClose={ onToggle }
        >
            <ColorBar
                updateColor={ updateColorAndClose }
                clearColor={ clearColor }
            />
        </ToolbarDropdown>
    );
};
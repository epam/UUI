import React, { useState } from 'react';

import { Button, Dropdown } from '@epam/uui-components';
import * as css from '../implementation/ToolbarButton.scss';
import { cx } from '@epam/uui-core';

import {
    getPluginType,
    ListToolbarButton,
    MarkToolbarButton,
    getListItemEntry,
    isMarkActive,
    isEditorFocused,
    useEventPlateId,
    usePlateEditorState,
    BalloonToolbar,
    usePlateEditorRef,
    LinkToolbarButton,
    PlateEditor,
    HeadingToolbar,
    setSelection,
} from '@udecode/plate';

import { ReactComponent as UnorderedList } from "../icons/bullet-list.svg";
import { ReactComponent as OrderedList } from "../icons/numbered-list.svg";
import { ReactComponent as LinkIcon } from "../icons/link.svg";

import { ReactComponent as HeadlinePickerIcon } from "../icons/heading.svg";
import { ReactComponent as ImageIcon } from "../icons/image.svg";
import { ReactComponent as SuperScriptIcon } from "../icons/super-script.svg";
import { ReactComponent as ColorIcon } from "../icons/text-color-normal.svg";

import { ToolbarButton as BoldButton } from '../plugins/customBold';
import { ToolbarButton as ItalicButton } from '../plugins/customItalic';
import { ToolbarButton as UnderlineButton } from '../plugins/customUnderline';
import { ToolbarButton as CodeButton } from '../plugins/customCode';

import { CustomBalloonToolbar } from '../components/CustomBalloonToolbar/CustomBalloonToolbar';

import { ColorPickerToolbarDropdown } from './ColorPickerToolbar';
import { HeaderBarToolbar } from "./HeaderBar";
import { ImageToolbarButton, InlineToolbarButton } from "./imagePlugin";
import { ToolbarButton } from "./linkPlugin";
import { ToDoListToolbarButton } from "./toDoListPlugin";

import { Toolbar } from "../../implementation/Toolbar";
import { Sidebar } from "../../implementation/Sidebar";

export const MarkBalloonToolbar = () => {
    const editorRef = usePlateEditorRef();

    return (
        <Toolbar editor={ editorRef } plugins={ [] }>
            <BoldButton editor={ editorRef } />
            <ItalicButton editor={ editorRef }/>
            <UnderlineButton editor={ editorRef }/>
            <CodeButton editor={ editorRef }/>
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editorRef, 'uui-richTextEditor-superscript') }
                icon={ <Button
                    icon={ SuperScriptIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editorRef?.selection && isMarkActive(editorRef, 'uui-richTextEditor-superscript'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <ColorPickerToolbarDropdown
                id={ editorRef?.id }
                editorRef={ editorRef }
                pluginKey={ getPluginType(editorRef, 'color') }
                icon={ <Button
                    icon={ ColorIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editorRef?.selection && isMarkActive(editorRef, 'uui-richTextEditor-italic'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <ToolbarButton/>
        </Toolbar>
    );
};

export const ImageBalloonToolbar = () => {
    const editor = usePlateEditorState(useEventPlateId());

    return (
        <CustomBalloonToolbar popperOptions={ { placement: 'auto' } }>
            <InlineToolbarButton editor={ editor } />
        </CustomBalloonToolbar>
    );
};

export const ListToolbarButtons = () => {
    const editor = usePlateEditorState(useEventPlateId());
    const res = !!editor?.selection && getListItemEntry(editor);
    return (
        <>
            <ToDoListToolbarButton id={ editor?.id }/>
            <ListToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'ordered-list-checkbox') }
                icon={ <Button
                    icon={ UnorderedList }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!res && res.list[0].type === 'ordered-list-checkbox' ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <ListToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'unordered-list') }
                icon={ <Button
                    icon={ UnorderedList }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!res && res.list[0].type === 'unordered-list' ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <ListToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'ordered-list') }
                icon={ <Button
                    icon={ OrderedList }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!res && res.list[0].type === 'ordered-list' ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
        </>
    );
};

const BlockToolbarButtons = () => {
    const editorRef = usePlateEditorRef(useEventPlateId());

    return (
        <>
            <HeaderBarToolbar
                id={ editorRef?.id }
                editorRef={ editorRef }
                pluginKey={ getPluginType(editorRef, 'color') }
                icon={ <Button
                    icon={ HeadlinePickerIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editorRef?.selection && isMarkActive(editorRef, 'uui-richTextEditor-italic'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <ImageToolbarButton
                id={ editorRef?.id }
                editorRef={ editorRef }
                pluginKey={ getPluginType(editorRef, 'image') }
                icon={ <Button
                    icon={ ImageIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editorRef?.selection && isMarkActive(editorRef, 'uui-richTextEditor-italic'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
        </>
    );
};

export const ToolbarButtons = () => {
    const editor = usePlateEditorState(useEventPlateId());
    const isActive = isEditorFocused(editor);

    if (!isActive) {
        return null;
    }

    return (
        <Sidebar isReadonly={ false } >
            <ListToolbarButtons />
            <BlockToolbarButtons />
        </Sidebar>
    );
};

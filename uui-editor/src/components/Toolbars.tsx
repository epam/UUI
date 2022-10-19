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
    BlockToolbarButton,
    MARK_COLOR,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    BalloonToolbar,
    ToolbarDropdown,
    usePlateEditorRef,
    LinkToolbarButton,
} from '@udecode/plate';

import { Check } from '@styled-icons/material/Check';
import { FormatColorText } from '@styled-icons/material/FormatColorText';

import { ColorPickerToolbarDropdown } from '@udecode/plate-ui-font';
import { ReactComponent as BoldIcon } from "../icons/bold.svg";
import { ReactComponent as ItalicIcon } from "../icons/italic.svg";
import { ReactComponent as UnderlineIcon } from "../icons/underline.svg";
import { ReactComponent as CodeIcon } from "../icons/editor-code.svg";
import { ReactComponent as UnorderedList } from "../icons/bullet-list.svg";
import { ReactComponent as OrderedList } from "../icons/numbered-list.svg";
import { ReactComponent as LinkIcon } from "../icons/link.svg";
//import { ReactComponent as HeadingIcon } from "../icons/heading.svg";
import { ReactComponent as HeadingH1Icon } from "../icons/heading-H1.svg";
import { ReactComponent as HeadingH2Icon } from "../icons/heading-H2.svg";
import { ReactComponent as HeadingH3Icon } from "../icons/heading-H3.svg";
import { ReactComponent as SuperScriptIcon } from "../icons/super-script.svg";

export const MarkBalloonToolbar = () => {
    const editor = usePlateEditorRef();

    return (
        <BalloonToolbar>
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'uui-richTextEditor-bold') }
                icon={ <Button
                    icon={ BoldIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-bold'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'uui-richTextEditor-italic') }
                icon={ <Button
                    icon={ ItalicIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-italic'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'uui-richTextEditor-underlined') }
                icon={ <Button
                    icon={ UnderlineIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-underlined'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'uui-richTextEditor-code') }
                icon={ <Button
                    icon={ CodeIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-code'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <MarkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, 'uui-richTextEditor-superscript') }
                icon={ <Button
                    icon={ SuperScriptIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-superscript'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
            <LinkToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                icon={ <Button
                    icon={ LinkIcon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-code'!) ? 'gray90' : 'gray80'],
                    ) }
                /> }
            />
        </BalloonToolbar>
    );
};

export const ListToolbarButtons = () => {
    const editor = usePlateEditorState(useEventPlateId());
    const res = !!editor?.selection && getListItemEntry(editor);
    return (
        <>
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
    const editor = usePlateEditorState(useEventPlateId());
    const res = !!editor?.selection && getListItemEntry(editor);
    return (
        <>
            <ColorPickerToolbarDropdown
                pluginKey={ MARK_COLOR }
                icon={ <FormatColorText /> }
                selectedIcon={ <Check /> }
            />
            <BlockToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, ELEMENT_H1) }
                icon={  <Button
                    icon={ HeadingH1Icon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!res && res.list[0].type === 'ordered-list' ? 'gray90' : 'gray80'],
                    ) }
                />  }
            />
            <BlockToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, ELEMENT_H2) }
                icon={  <Button
                    icon={ HeadingH2Icon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!res && res.list[0].type === 'ordered-list' ? 'gray90' : 'gray80'],
                    ) }
                />  }
            />
            <BlockToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                type={ getPluginType(editor, ELEMENT_H3) }
                icon={  <Button
                    icon={ HeadingH3Icon }
                    cx={ cx(
                        css.toolbarButton,
                        // Because iconColor comes undefined
                        css['color-' + undefined],
                        css[!!res && res.list[0].type === 'ordered-list' ? 'gray90' : 'gray80'],
                    ) }
                />  }
            />
        </>
    );
};

export const ToolbarButtons = () => {
    const editor = usePlateEditorState(useEventPlateId());
    const isActive = isEditorFocused(editor);

    if (!isActive) {
        // return null;
    }

    return (
        <>
            <ListToolbarButtons />
            <BlockToolbarButtons />
        </>
    );
};

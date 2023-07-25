import { EText, PlateEditor, PlatePluginComponent, TText, Value, isMarkActive } from '@udecode/plate-common';
import React from 'react';

import { isPluginActive } from '../../helpers';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import { MARK_BOLD, MARK_ITALIC, MARK_UNDERLINE, createBoldPlugin, createItalicPlugin, createUnderlinePlugin } from '@udecode/plate-basic-marks';
import { ReactComponent as BoldIcon } from "../../icons/bold.svg";
import { ReactComponent as ItalicIcon } from "../../icons/italic.svg";
import { ReactComponent as UnderlineIcon } from "../../icons/underline.svg";
import { handleMarkButtonClick } from '../../utils/handleMarkButtonClick';

const BOLD_KEY = 'uui-richTextEditor-bold';
const ITALIC_KEY = 'uui-richTextEditor-italic';
const UNDERLINE_KEY = 'uui-richTextEditor-underlined';

const Bold: PlatePluginComponent = (props) => {
    const { attributes, children } = props;

    return (
        <span { ...attributes }><strong>{ children }</strong></span>
    );
};

const Italic: PlatePluginComponent = (props) => {
    const { attributes, children } = props;

    return (
        <span { ...attributes }><i>{ children }</i></span>
    );
};

const Underline: PlatePluginComponent = (props) => {
    const { attributes, children } = props;

    return (
        <span { ...attributes }><u>{ children }</u></span>
    );
};

const boldPlugin = createBoldPlugin({
    type: BOLD_KEY,
    component: Bold,
});

const italicPlugin = createItalicPlugin({
    type: ITALIC_KEY,
    component: Italic,
});

const underlinePlugin = createUnderlinePlugin({
    type: UNDERLINE_KEY,
    component: Underline,
});

interface IToolbarButton {
    editor: PlateEditor;
}

export const BoldButton = ({ editor }: IToolbarButton) => {
    if (!isPluginActive(MARK_BOLD)) return null;
    return (
        <ToolbarButton
            onClick={ handleMarkButtonClick(editor, BOLD_KEY) }
            icon={ BoldIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, BOLD_KEY!) }
        />
    );
};

export const ItalicButton = ({ editor }: IToolbarButton) => {
    if (!isPluginActive(MARK_ITALIC)) return null;
    return (
        <ToolbarButton
            onClick={ handleMarkButtonClick(editor, ITALIC_KEY) }
            icon={ ItalicIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, ITALIC_KEY!) }
        />
    );
};

export const UnderlineButton = ({ editor }: IToolbarButton) => {
    if (!isPluginActive(MARK_UNDERLINE)) return null;
    return (
        <ToolbarButton
            onClick={ handleMarkButtonClick(editor, UNDERLINE_KEY) }
            icon={ UnderlineIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, UNDERLINE_KEY!) }
        />
    );
};

export const baseMarksPlugin = () => ([
    boldPlugin,
    underlinePlugin,
    italicPlugin,
]);




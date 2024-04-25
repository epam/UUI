import {
    PlateEditor, PlatePluginComponent, isMarkActive, PlatePlugin,
} from '@udecode/plate-common';
import React from 'react';

import { useIsPluginActive } from '../../helpers';

import { ToolbarButton } from '../../implementation/ToolbarButton';
import { WithToolbarButton } from '../../implementation/Toolbars';

import {
    MARK_BOLD, MARK_ITALIC, MARK_UNDERLINE, createBoldPlugin, createItalicPlugin, createUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { ReactComponent as BoldIcon } from '../../icons/bold.svg';
import { ReactComponent as ItalicIcon } from '../../icons/italic.svg';
import { ReactComponent as UnderlineIcon } from '../../icons/underline.svg';
import { handleMarkButtonClick } from '../../utils/handleMarkButtonClick';

export const BOLD_KEY = 'uui-richTextEditor-bold';
export const ITALIC_KEY = 'uui-richTextEditor-italic';
export const UNDERLINE_KEY = 'uui-richTextEditor-underlined';

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

export const boldPlugin = () => createBoldPlugin<WithToolbarButton>({
    type: BOLD_KEY,
    component: Bold,
    options: {
        floatingBarButton: BoldButton,
    },
});

export const italicPlugin = () => createItalicPlugin<WithToolbarButton>({
    type: ITALIC_KEY,
    component: Italic,
    options: {
        floatingBarButton: ItalicButton,
    },
});

const underlinePlugin = () => createUnderlinePlugin<WithToolbarButton>({
    type: UNDERLINE_KEY,
    component: Underline,
    options: {
        floatingBarButton: UnderlineButton,
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function BoldButton({ editor }: IToolbarButton) {
    if (!useIsPluginActive(MARK_BOLD)) return null;
    return (
        <ToolbarButton
            onClick={ handleMarkButtonClick(editor, BOLD_KEY) }
            icon={ BoldIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, BOLD_KEY!) }
        />
    );
}

export function ItalicButton({ editor }: IToolbarButton) {
    if (!useIsPluginActive(MARK_ITALIC)) return null;
    return (
        <ToolbarButton
            onClick={ handleMarkButtonClick(editor, ITALIC_KEY) }
            icon={ ItalicIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, ITALIC_KEY!) }
        />
    );
}

export function UnderlineButton({ editor }: IToolbarButton) {
    if (!useIsPluginActive(MARK_UNDERLINE)) return null;
    return (
        <ToolbarButton
            onClick={ handleMarkButtonClick(editor, UNDERLINE_KEY) }
            icon={ UnderlineIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, UNDERLINE_KEY!) }
        />
    );
}

export const baseMarksPlugin = (): PlatePlugin[] => ([
    boldPlugin(),
    underlinePlugin(),
    italicPlugin(),
]);

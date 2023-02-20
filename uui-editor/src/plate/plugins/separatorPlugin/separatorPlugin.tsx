import React from 'react';

import {
    BlockToolbarButton,
    createHorizontalRulePlugin,
    getPluginType,
    isMarkActive,
    PlateEditor,
} from '@udecode/plate';

import { isPluginActive, isTextSelected } from '../../../helpers';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as SeparateIcon } from '../../../icons/breakline.svg';

import { Separator } from './Separator';

const KEY = 'separatorBLock';
const noop = () => {};

export const separatorPlugin = () => createHorizontalRulePlugin({
    key: KEY,
    isVoid: true,
    isElement: true,
    component: Separator,
});

interface ToolbarButton {
    editor: PlateEditor;
}

export const SeparatorButton = ({ editor }: ToolbarButton) => {
    if (!isPluginActive(KEY)) return null;

    return (
        <BlockToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer', padding: '0px' }} }
            type={ getPluginType(editor, KEY) }
            actionHandler='onMouseDown'
            icon={ <ToolbarButton
                isDisabled={ isTextSelected(editor, true) }
                onClick={ noop }
                icon={ SeparateIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, KEY!) }
            /> }
        />
    );
};
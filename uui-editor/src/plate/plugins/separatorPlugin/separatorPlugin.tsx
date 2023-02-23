import React from 'react';

import {
    BlockToolbarButton,
    getPluginType,
    isMarkActive,
    PlateEditor,
    createPluginFactory,
} from '@udecode/plate';

import { isPluginActive, isTextSelected } from '../../../helpers';

import { ToolbarButton } from '../../../implementation/ToolbarButton';

import { ReactComponent as SeparateIcon } from '../../../icons/breakline.svg';

import { Separator } from './Separator';

const KEY = 'separatorBLock';
const noop = () => {};

export const separatorPlugin = () => {
    const createSeparatorPlugin = createPluginFactory({
        key: KEY,
        isElement: true,
        isVoid: true,
        component: Separator,
        deserializeHtml: {
            rules: [
                {
                    validNodeName: 'HR',
                },
            ],
        },
    });

    return createSeparatorPlugin();
};

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
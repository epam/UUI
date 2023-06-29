import React from 'react';

import {
    BlockToolbarButton,
    getPluginType,
    isMarkActive,
    PlateEditor,
    createPluginFactory, insertEmptyElement,
} from '@udecode/plate';

import { isPluginActive, isTextSelected } from '../../helpers';

import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as SeparateIcon } from '../../icons/breakline.svg';

import { Separator } from './Separator';
import { getBlockAboveByType } from "../../utils/getAboveBlock";
import { PARAGRAPH_TYPE } from "../paragraphPlugin/paragraphPlugin";
import { Editor } from 'slate';

const SEPARATOR_TYPE = 'separatorBLock';
const noop = () => {};

export const separatorPlugin = () => {
    const createSeparatorPlugin = createPluginFactory({
        key: SEPARATOR_TYPE,
        isElement: true,
        isVoid: true,
        component: Separator,
        handlers: {
            onKeyDown: (editor) => (event) => {
                if (!getBlockAboveByType(editor, [SEPARATOR_TYPE])) return;

                if (event.key === 'Enter') {
                    return insertEmptyElement(editor, PARAGRAPH_TYPE);
                }

                // empty element needs to be added when we have only attachment in editor content
                if (event.key === 'Backspace') {
                    insertEmptyElement(editor, PARAGRAPH_TYPE);
                }

                if (event.key === 'Delete') {
                    Editor.deleteForward(editor as any);
                    insertEmptyElement(editor, PARAGRAPH_TYPE);
                }
            },
        },
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
    if (!isPluginActive(SEPARATOR_TYPE)) return null;

    return (
        <BlockToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            type={ getPluginType(editor, SEPARATOR_TYPE) }
            actionHandler='onMouseDown'
            icon={ <ToolbarButton
                isDisabled={ isTextSelected(editor, true) }
                onClick={ noop }
                icon={ SeparateIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, SEPARATOR_TYPE!) }
            /> }
        />
    );
};
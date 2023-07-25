import { PlateEditor, createPluginFactory, focusEditor, insertEmptyElement, isMarkActive, toggleNodeType } from '@udecode/plate-common';
import React from 'react';
import { Editor } from 'slate';

import { isPluginActive, isTextSelected } from '../../helpers';
import { ReactComponent as SeparateIcon } from '../../icons/breakline.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { getBlockAboveByType } from "../../utils/getAboveBlock";
import { PARAGRAPH_TYPE } from "../paragraphPlugin/paragraphPlugin";
import { Separator } from './Separator';

const SEPARATOR_TYPE = 'separatorBLock';

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

    const onSeparatorButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        e.preventDefault();
        e.stopPropagation();

        toggleNodeType(editor, { activeType: type });
        focusEditor(editor);
    }

    return (
        <ToolbarButton
            isDisabled={ isTextSelected(editor, true) }
            onClick={ (e) => onSeparatorButtonClick(e, SEPARATOR_TYPE) }
            icon={ SeparateIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, SEPARATOR_TYPE) }
        />
    );
};
import React from 'react';
import { PlateEditor, createPluginFactory, focusEditor, insertEmptyElement, isMarkActive, toggleNodeType } from '@udecode/plate-common';

import { isPluginActive, isTextSelected } from '../../helpers';
import { ReactComponent as SeparateIcon } from '../../icons/breakline.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { Separator } from './Separator';
import { getBlockAboveByType } from '../../utils/getAboveBlock';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/paragraphPlugin';

export const SEPARATOR_KEY = 'separatorBLock';

export const separatorPlugin = () => {
    const createSeparatorPlugin = createPluginFactory({
        key: SEPARATOR_KEY,
        type: SEPARATOR_KEY,
        isElement: true,
        isVoid: true,
        component: Separator,
        handlers: {
            onKeyDown: (editor) => (event) => {
                if (!getBlockAboveByType(editor, [SEPARATOR_KEY])) return;

                if (event.key === 'Enter') {
                    return insertEmptyElement(editor, PARAGRAPH_TYPE);
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

interface ToolbarButtonProps {
    editor: PlateEditor;
}

export function SeparatorButton({ editor }: ToolbarButtonProps) {
    if (!isPluginActive(SEPARATOR_KEY)) return null;

    const onSeparatorButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        e.preventDefault();
        e.stopPropagation();

        toggleNodeType(editor, { activeType: type });
        focusEditor(editor);
    };

    return (
        <ToolbarButton
            isDisabled={ isTextSelected(editor, true) }
            onClick={ (e) => onSeparatorButtonClick(e, SEPARATOR_KEY) }
            icon={ SeparateIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, SEPARATOR_KEY) }
        />
    );
}

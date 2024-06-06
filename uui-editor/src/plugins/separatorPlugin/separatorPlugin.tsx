import React from 'react';
import {
    PlateEditor, focusEditor, insertEmptyElement, isMarkActive, toggleNodeType, PlatePlugin,
} from '@udecode/plate-common';

import { useIsPluginActive, isTextSelected } from '../../helpers';
import { ReactComponent as SeparateIcon } from '../../icons/breakline.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { Separator } from './Separator';
import { getBlockAboveByType } from '../../utils/getAboveBlock';
import { WithToolbarButton } from '../../implementation/Toolbars';
import { createHorizontalRulePlugin } from '@udecode/plate-horizontal-rule';
import { PARAGRAPH_TYPE } from '../paragraphPlugin/constants';
import { SEPARATOR_PLUGIN_KEY, SEPARATOR_TYPE } from './constants';

export const separatorPlugin = (): PlatePlugin<WithToolbarButton> => {
    return createHorizontalRulePlugin<WithToolbarButton>({
        key: SEPARATOR_PLUGIN_KEY,
        type: SEPARATOR_TYPE,
        component: Separator,
        serializeHtml: () => {
            return <hr />;
        },
        handlers: {
            onKeyDown: (editor) => (event) => {
                if (!getBlockAboveByType(editor, [SEPARATOR_TYPE])) return;

                if (event.key === 'Enter') {
                    return insertEmptyElement(editor, PARAGRAPH_TYPE);
                }
            },
        },
        options: {
            bottomBarButton: SeparatorButton,
        },
    });
};

interface ToolbarButtonProps {
    editor: PlateEditor;
}

export function SeparatorButton({ editor }: ToolbarButtonProps) {
    if (!useIsPluginActive(SEPARATOR_PLUGIN_KEY)) return null;

    const onSeparatorButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
        e.preventDefault();
        e.stopPropagation();

        toggleNodeType(editor, { activeType: type });
        focusEditor(editor);
    };

    return (
        <ToolbarButton
            isDisabled={ isTextSelected(editor, true) }
            onClick={ (e) => onSeparatorButtonClick(e, SEPARATOR_TYPE) }
            icon={ SeparateIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, SEPARATOR_TYPE) }
        />
    );
}

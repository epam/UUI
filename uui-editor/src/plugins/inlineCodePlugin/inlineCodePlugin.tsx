import { createCodePlugin } from '@udecode/plate-basic-marks';
import {
    PlateEditor, PlateElementProps, isMarkActive,
} from '@udecode/plate-common';
import React from 'react';

import { useIsPluginActive } from '../../helpers';
import { ReactComponent as CodeIcon } from '../../icons/editor-code.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { handleMarkButtonClick } from '../../utils/handleMarkButtonClick';
import { WithToolbarButton } from '../../implementation/Toolbars';

export const INLINE_CODE_KEY = 'uui-richTextEditor-code';

function Code(props: PlateElementProps) {
    const { attributes, children } = props;
    return (
        <span { ...attributes }><code>{ children }</code></span>
    );
}

export const codeBlockPlugin = () => createCodePlugin<WithToolbarButton>({
    key: INLINE_CODE_KEY,
    type: INLINE_CODE_KEY,
    component: Code,
    options: {
        floatingBarButton: CodeButton,
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function CodeButton({ editor }: IToolbarButton) {
    if (!useIsPluginActive(INLINE_CODE_KEY)) return null;
    return (
        <ToolbarButton
            onClick={ handleMarkButtonClick(editor, INLINE_CODE_KEY) }
            icon={ CodeIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, INLINE_CODE_KEY) }
        />
    );
}

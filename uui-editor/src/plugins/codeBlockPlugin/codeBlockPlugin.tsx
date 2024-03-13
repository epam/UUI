import { createCodePlugin } from '@udecode/plate-basic-marks';
import { PlateEditor, PlatePluginComponent, isMarkActive } from '@udecode/plate-common';
import React from 'react';

import { isPluginActive } from '../../helpers';
import { ReactComponent as CodeIcon } from '../../icons/editor-code.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { handleMarkButtonClick } from '../../utils/handleMarkButtonClick';
import { WithToolbarButton } from '../../implementation/Toolbars';

export const CODE_BLOCK_KEY = 'uui-richTextEditor-code';

const Code: PlatePluginComponent = (props) => {
    const { attributes, children } = props;
    return (
        <span { ...attributes }><code>{ children }</code></span>
    );
};

export const codeBlockPlugin = () => createCodePlugin<WithToolbarButton>({
    key: CODE_BLOCK_KEY,
    type: CODE_BLOCK_KEY,
    component: Code,
    options: {
        floatingBarButton: CodeButton,
        name: 'floating-button',
    },
});

interface IToolbarButton {
    editor: PlateEditor;
}

export function CodeButton({ editor }: IToolbarButton) {
    if (!isPluginActive(CODE_BLOCK_KEY)) return null;
    return (
        <ToolbarButton
            onClick={ handleMarkButtonClick(editor, CODE_BLOCK_KEY) }
            icon={ CodeIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, CODE_BLOCK_KEY) }
        />
    );
}

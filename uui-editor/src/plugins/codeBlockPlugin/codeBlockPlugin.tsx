import { createCodePlugin } from '@udecode/plate-basic-marks';
import { EText, PlateEditor, TText, Value, isMarkActive } from '@udecode/plate-common';
import type { StyledLeafProps } from '@udecode/plate-styled-components';
import React from 'react';

import { isPluginActive } from "../../helpers";
import { ReactComponent as CodeIcon } from "../../icons/editor-code.svg";
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { onClickToolbarButton } from '../../utils/onClickToolbarButton';

const CODE_BLOCK_KEY = 'uui-richTextEditor-code';

const Code = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;
    return (
        <span { ...attributes }><code>{ children }</code></span>
    );
};

export const codeBlockPlugin = () => createCodePlugin({
    key: CODE_BLOCK_KEY,
    type: CODE_BLOCK_KEY,
    component: Code,
});

interface ToolbarButton {
    editor: PlateEditor;
}

export const CodeButton = ({ editor }: ToolbarButton) => {
    if (!isPluginActive(CODE_BLOCK_KEY)) return null;
    return (
        <ToolbarButton
            onClick={ onClickToolbarButton(editor, CODE_BLOCK_KEY) }
            icon={ CodeIcon }
            isActive={ !!editor?.selection && isMarkActive(editor, CODE_BLOCK_KEY) }
        />
    );
};
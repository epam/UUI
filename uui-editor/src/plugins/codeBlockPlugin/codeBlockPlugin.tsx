import React from 'react';
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { ReactComponent as CodeIcon } from "../../icons/editor-code.svg";
import { isPluginActive } from "../../helpers";
import { EText, TText, Value } from '@udecode/slate';
import { MarkToolbarButton, StyledLeafProps } from '@udecode/plate-ui';
import { createCodePlugin } from '@udecode/plate-basic-marks';
import { PlateEditor, getPluginType } from '@udecode/plate-core';
import { isMarkActive } from '@udecode/slate-utils';

const KEY = 'uui-richTextEditor-code';
const noop = () => {};

const Code = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;
    return (
        <span { ...attributes }><code>{ children }</code></span>
    );
};

export const codeBlockPlugin = () => createCodePlugin({
    key: KEY,
    component: Code,
});

interface ToolbarButton {
    editor: PlateEditor;
}

export const CodeButton = ({ editor }: ToolbarButton) => {
    if (!isPluginActive(KEY)) return null;
    return (
        <MarkToolbarButton
            styles={ { root: { width: 'auto', height: 'auto', cursor: 'pointer', padding: '0px' } } }
            type={ getPluginType(editor, KEY) }
            icon={ <ToolbarButton
                onClick={ noop }
                icon={ CodeIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, KEY!) }
            /> }
        />
    );
};
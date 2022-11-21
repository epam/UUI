import React from 'react';
import {
    StyledLeafProps,
    EText,
    TText,
    Value,
    createCodePlugin,
    MarkToolbarButton,
    MARK_CODE,
    getPluginType,
    isMarkActive,
} from "@udecode/plate";
import { ToolbarButton as UUIToolbarButton } from "../implementation/ToolbarButton";
import { ReactComponent as CodeIcon } from "../icons/editor-code.svg";
import { isPluginActive } from "../../helpers";

export const CustomCode = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;

    return (
        <span { ...attributes }><code>{ children }</code></span>
    );
};

export const createUUICodePlugin = createCodePlugin({
    type: 'uui-richTextEditor-code',
    component: CustomCode,
});

export const ToolbarButton = (editor: any) => {
    if (!isPluginActive(MARK_CODE)) return null;

    return (
        <MarkToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer' }} }
            type={ getPluginType(editor, 'uui-richTextEditor-code') }
            icon={ <UUIToolbarButton
                onClick={ () => {} }
                icon={ CodeIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-code'!) }
            /> }
        />
    );
};
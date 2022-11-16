import React from 'react';
import {
    StyledLeafProps,
    EText,
    TText,
    Value,
    createUnderlinePlugin,
    MarkToolbarButton,
    getPluginType,
    isMarkActive,
} from "@udecode/plate";
import { ToolbarButton as UUIToolbarButton } from "../implementation/ToolbarButton";

import { ReactComponent as UnderlineIcon } from "../icons/underline.svg";

export const CustomUnderline = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;

    return (
        <span { ...attributes }><u>{ children }</u></span>
    );
};

export const createUUIUnderlinePlugin = createUnderlinePlugin({
    type: 'uui-richTextEditor-underlined',
    component: CustomUnderline,
});

export const ToolbarButton = (editor: any) => {
    return (
        <MarkToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer' }} }
            type={ getPluginType(editor, 'uui-richTextEditor-underlined') }
            icon={ <UUIToolbarButton
                onClick={ () => {} }
                icon={ UnderlineIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-underlined'!) }
            /> }
        />
    );
};
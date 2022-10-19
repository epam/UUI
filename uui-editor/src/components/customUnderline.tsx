import React from 'react';
import { StyledLeafProps, EText, TText, Value, createPluginFactory, onKeyDownToggleMark } from "@udecode/plate";

export const CustomUnderline = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;

    return (
        <span { ...attributes }><u>{ children }</u></span>
    );
};

export const createUUIUnderlinePlugin = createPluginFactory({
    key: 'uui-richTextEditor-underlined',
    isLeaf: true,
    handlers: {
        onKeyDown: onKeyDownToggleMark,
    },
    component: CustomUnderline,
});
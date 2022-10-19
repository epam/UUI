import React from 'react';
import { StyledLeafProps, EText, TText, Value, createPluginFactory, onKeyDownToggleMark } from "@udecode/plate";

export const CustomCode = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;

    return (
        <span { ...attributes }><code>{ children }</code></span>
    );
};

export const createUUICodePlugin = createPluginFactory({
    key: 'uui-richTextEditor-code',
    isLeaf: true,
    handlers: {
        onKeyDown: onKeyDownToggleMark,
    },
    component: CustomCode,
});
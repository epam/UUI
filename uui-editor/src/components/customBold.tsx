import React from 'react';
import { StyledLeafProps, EText, TText, Value, createPluginFactory, onKeyDownToggleMark } from "@udecode/plate";

export const CustomBold = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;

    return (
       <span { ...attributes }><strong>{ children }</strong></span>
    );
};

export const createUUIBoldPlugin = createPluginFactory({
    key: 'uui-richTextEditor-bold',
    isLeaf: true,
    handlers: {
        onKeyDown: onKeyDownToggleMark,
    },
    component: CustomBold,
});
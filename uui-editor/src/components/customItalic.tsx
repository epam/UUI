import React from 'react';
import { StyledLeafProps, EText, TText, Value, createPluginFactory, onKeyDownToggleMark } from "@udecode/plate";

export const CustomItalic = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;

    return (
        <span { ...attributes }><i>{ children }</i></span>
    );
};

export const createUUIItalicPlugin = createPluginFactory({
    key: 'uui-richTextEditor-italic',
    isLeaf: true,
    handlers: {
        onKeyDown: onKeyDownToggleMark,
    },
    component: CustomItalic,
});
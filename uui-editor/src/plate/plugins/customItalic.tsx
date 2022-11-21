import React from 'react';
import {
    StyledLeafProps,
    EText,
    TText,
    Value,
    MARK_ITALIC,
    createItalicPlugin, MarkToolbarButton, getPluginType, isMarkActive,
} from "@udecode/plate";
import { ToolbarButton as UUIToolbarButton } from "../../implementation/ToolbarButton";
import { ReactComponent as ItalicIcon } from "../icons/italic.svg";
import { isPluginActive } from "../../helpers";

export const CustomItalic = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;

    return (
        <span { ...attributes }><i>{ children }</i></span>
    );
};

export const createUUIItalicPlugin = createItalicPlugin({
    type: 'uui-richTextEditor-italic',
    component: CustomItalic,
});

export const ToolbarButton = (editor: any) => {
    if (!isPluginActive(MARK_ITALIC)) return null;
    return (
        <MarkToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer' }} }
            type={ getPluginType(editor, 'uui-richTextEditor-italic') }
            icon={ <UUIToolbarButton
                onClick={ () => {} }
                icon={ ItalicIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-italic'!) }
            /> }
        />
    );
};

import React from 'react';
import {
    StyledLeafProps,
    EText,
    TText,
    Value,
    getPluginType,
    MarkToolbarButton,
    isMarkActive,
    createBoldPlugin,
    usePlatePlugins,
} from "@udecode/plate";

import { isPluginActive } from '../../helpers';

import { ToolbarButton as UUIToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as BoldIcon } from "../icons/bold.svg";

export const CustomBold = <V extends Value = Value, N extends TText = EText<V>>(
    props: StyledLeafProps<V, N>,
) => {
    const { attributes, children } = props;

    return (
       <span { ...attributes }><strong>{ children }</strong></span>
    );
};

export const createUUIBoldPlugin = createBoldPlugin({
    type: 'uui-richTextEditor-bold',
    component: CustomBold,
});

export const ToolbarButton = (editor: any) => {

    if (!isPluginActive('bold')) return null;

    return (
        <MarkToolbarButton
            styles={ { root: {width: 'auto', cursor: 'pointer' }} }
            type={ getPluginType(editor, 'uui-richTextEditor-bold') }
            icon={ <UUIToolbarButton
                onClick={ () => {} }
                icon={ BoldIcon }
                isActive={ !!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-bold'!) }
            /> }
        />
    );
};


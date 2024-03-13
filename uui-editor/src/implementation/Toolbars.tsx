import React, { Fragment, useMemo } from 'react';
import {
    useEditorRef, isEditorFocused, PlateEditor, WithPlatePlugin, Value, PluginOptions,
} from '@udecode/plate-common';
import { StickyToolbar } from './StickyToolbar';
import { PositionedToolbar } from './PositionedToolbar';

interface ToolbarButtonProps {
    editor: PlateEditor;
}

type WithFloatingButtonPlugin = {
    name: string;
    floatingBarButton: React.ComponentType<ToolbarButtonProps>,
};

type WithBottomButtonPlugin = {
    bottomBarButton: React.ComponentType<ToolbarButtonProps>
    name: string;
};

export type WithToolbarButton = WithBottomButtonPlugin | WithFloatingButtonPlugin | PluginOptions;

type WithButtonPlugin = WithPlatePlugin<WithToolbarButton, Value, PlateEditor<Value>>;

const isBottomButtonPlugin = (options?: WithToolbarButton): options is WithBottomButtonPlugin => !!options && 'bottomBarButton' in options;

const isFloatingButtonPlugin = (options?: WithToolbarButton): options is WithFloatingButtonPlugin => !!options && 'floatingBarButton' in options;

const getButtons = (editorRef: PlateEditor<Value>) => {
    const plugins = editorRef?.plugins as WithButtonPlugin[];
    return plugins.reduce<{ floating:JSX.Element[]; bottom: JSX.Element[] }>((acc, p) => {
        if (isBottomButtonPlugin(p.options)) {
            const Button = p.options.bottomBarButton;
            acc.bottom.push(<Button key={ p.options.name } editor={ editorRef } />);
        } else if (isFloatingButtonPlugin(p.options)) {
            const Button = p.options.floatingBarButton;
            acc.floating.push(<Button key={ p.options.name } editor={ editorRef } />);
        }
        return acc;
    }, {
        floating: [],
        bottom: [],
    });
};

export function Toolbars() {
    const editorRef = useEditorRef();
    const isActive = isEditorFocused(editorRef);

    const { bottom, floating } = useMemo(() => getButtons(editorRef), [editorRef.plugins]);

    return (
        <Fragment>
            <PositionedToolbar isImage={ false } editor={ editorRef }>
                { floating}
            </PositionedToolbar>
            {isActive && (
                <StickyToolbar isReadonly={ false }>
                    { bottom }
                </StickyToolbar>
            )}
        </Fragment>
    );
}

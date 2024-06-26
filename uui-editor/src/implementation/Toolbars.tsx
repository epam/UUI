import React, { Fragment, useMemo } from 'react';
import { useEditorRef, PlateEditor, WithPlatePlugin, Value, PluginOptions } from '@udecode/plate-common';
import { StickyToolbar } from './StickyToolbar';
import { FloatingToolbar } from './PositionedToolbar';

interface ToolbarButtonProps {
    editor: PlateEditor;
}

export type WithFloatingButtonPlugin = {
    floatingBarButton: React.ComponentType<ToolbarButtonProps>,
};

export type WithBottomButtonPlugin = {
    bottomBarButton: React.ComponentType<ToolbarButtonProps>
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
            acc.bottom.push(<Button key={ p.key } editor={ editorRef } />);
        } else if (isFloatingButtonPlugin(p.options)) {
            const Button = p.options.floatingBarButton;
            acc.floating.push(<Button key={ p.key } editor={ editorRef } />);
        }
        return acc;
    }, {
        floating: [],
        bottom: [],
    });
};

export function Toolbars({
    toolbarPosition = 'floating',
}: {
    toolbarPosition?: 'floating' | 'fixed';
}) {
    const editorRef = useEditorRef();
    const { bottom, floating } = useMemo(() => getButtons(editorRef), [editorRef]);

    return (
        <Fragment>
            { toolbarPosition === 'floating' && (
                <FloatingToolbar isImage={ false } editor={ editorRef }>
                    { floating }
                </FloatingToolbar>
            ) }

            <StickyToolbar>
                { toolbarPosition === 'floating' ? bottom : [...floating, ...bottom] }
            </StickyToolbar>
        </Fragment>
    );
}

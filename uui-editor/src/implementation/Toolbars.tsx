import React from 'react';
import { useEventPlateId, useEditorRef, useEditorState, isEditorFocused, PlateEditor, WithPlatePlugin } from '@udecode/plate-common';
import { StickyToolbar } from './StickyToolbar';
import { PositionedToolbar } from './PositionedToolbar';

interface ToolbarButtonProps {
    editor: PlateEditor;
}
export interface IHasToolbarButton {
    floatingBarButton?: React.ComponentType<ToolbarButtonProps>,
    bottomBarButton?: React.ComponentType<ToolbarButtonProps>
    name?: string;
}
export function MarksToolbar() {
    const editorRef = useEditorRef();

    return (
        <PositionedToolbar isImage={ false } editor={ editorRef }>
            { editorRef?.plugins.map((p: WithPlatePlugin<IHasToolbarButton>) => {
                const Button = p.options?.floatingBarButton;
                return Button && <Button key={ p.options.name } editor={ editorRef } />;
            }) }
        </PositionedToolbar>
    );
}

export function MainToolbar() {
    const editor = useEditorState(useEventPlateId());
    const isActive = isEditorFocused(editor);

    if (!isActive) {
        return null;
    }

    return (
        <StickyToolbar isReadonly={ false }>
            { editor?.plugins.map((p: WithPlatePlugin<IHasToolbarButton>) => {
                const Button = p.options?.bottomBarButton;
                return Button && <Button key={ p.options.name } editor={ editor } />;
            }) }
        </StickyToolbar>
    );
}

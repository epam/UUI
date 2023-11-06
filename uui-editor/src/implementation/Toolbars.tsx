import React from 'react';
import { useEventPlateId, usePlateEditorRef, usePlateEditorState, isEditorFocused, PlateEditor } from '@udecode/plate-common';
import { StickyToolbar } from './StickyToolbar';
import { PositionedToolbar } from './PositionedToolbar';
import { WithPlatePlugin } from "@udecode/plate-core";

interface ToolbarButtonProps {
    editor: PlateEditor;
}
export interface IHasToolbarButton {
    floatingBarButton?: React.ComponentType<ToolbarButtonProps>,
    bottomBarButton?: React.ComponentType<ToolbarButtonProps>
}
export function MarksToolbar() {
    const editorRef = usePlateEditorRef();

    return (
        <PositionedToolbar isImage={ false } editor={ editorRef } plugins={ [] }>
            { editorRef?.plugins.map((p: WithPlatePlugin<IHasToolbarButton>) => {
                const Button = p.options?.floatingBarButton;
                return Button && <Button editor={ editorRef } />;
            }) }
        </PositionedToolbar>
    );
}

export function MainToolbar() {
    const editor = usePlateEditorState(useEventPlateId());
    const isActive = isEditorFocused(editor);

    if (!isActive) {
        return null;
    }

    return (
        <StickyToolbar isReadonly={ false }>
            { editor?.plugins.map((p: WithPlatePlugin<IHasToolbarButton>) => {
                const Button = p.options?.bottomBarButton;
                return Button && <Button editor={ editor } />;
            }) }
        </StickyToolbar>
    );
}

import { createPluginFactory, eventEditorActions, eventEditorSelectors, KEY_EVENT_EDITOR } from '@udecode/plate-core';
import { useEffect } from 'react';

export const FOCUS_EDITOR_EVENT = 'uui-focus-editor';
export const BLUR_EDITOR_EVENT = 'uui-blur-editor';

// TODO: move to plate
export const createEventEditorPlugin = createPluginFactory({
    key: KEY_EVENT_EDITOR,
    handlers: {
        onFocus: (editor) => () => {
            eventEditorActions.focus(editor.id);

            document.dispatchEvent(
                new CustomEvent(FOCUS_EDITOR_EVENT, {
                    detail: { id: editor.id },
                }),
            );
        },
        onBlur: (editor) => () => {
            const focus = eventEditorSelectors.focus();
            if (focus === editor.id) {
                eventEditorActions.focus(null);
            }
            eventEditorActions.blur(editor.id);

            document.dispatchEvent(
                new CustomEvent(BLUR_EDITOR_EVENT, {
                    detail: { id: editor.id } }),
            );
        },
    },
});

export const useFocusEvents = ({
    editorId,
    onFocus,
    onBlur,
}: {
    editorId: string,
    onFocus: () => void,
    onBlur: () => void
}) => {
    useEffect(() => {
        const onFocusEditor = (event: Event) => {
            const id = (event as any).detail.id;
            if (editorId === id) {
                onFocus();
            }
        };
        const onBlurEditor = (event: Event) => {
            const id = (event as any).detail.id;
            if (editorId === id) {
                onBlur();
            }
        };

        document.addEventListener(FOCUS_EDITOR_EVENT, onFocusEditor);
        document.addEventListener(BLUR_EDITOR_EVENT, onBlurEditor);

        return () => {
            document.removeEventListener(FOCUS_EDITOR_EVENT, onFocusEditor);
            document.removeEventListener(BLUR_EDITOR_EVENT, onBlurEditor);
        };
    }, [editorId, onFocus, onBlur]);
};

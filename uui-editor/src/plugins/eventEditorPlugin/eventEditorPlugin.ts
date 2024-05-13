import { createPluginFactory, eventEditorActions, eventEditorSelectors, KEY_EVENT_EDITOR } from '@udecode/plate-core';
import { MutableRefObject, useEffect } from 'react';
import { uuiMod } from '@epam/uui-core';

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
                    detail: { id: editor.id },
                }),
            );
        },
    },
});

export const useFocusEvents = ({
    editorWrapperRef,
    editorId,
    isReadonly,
}: {
    editorWrapperRef: MutableRefObject<HTMLDivElement>
    editorId: string,
    isReadonly?: boolean,
}) => {
    useEffect(() => {
        const onFocusEditor = (event: Event) => {
            const id = (event as any).detail.id;
            const allowFocus = editorWrapperRef.current && !isReadonly && editorId === id;
            if (allowFocus) {
                editorWrapperRef.current.classList.add(uuiMod.focus);
            }
        };
        const onBlurEditor = (event: Event) => {
            const id = (event as any).detail.id;
            if (editorWrapperRef.current && editorId === id) {
                editorWrapperRef.current.classList.remove(uuiMod.focus);
            }
        };

        document.addEventListener(FOCUS_EDITOR_EVENT, onFocusEditor);
        document.addEventListener(BLUR_EDITOR_EVENT, onBlurEditor);

        return () => {
            document.removeEventListener(FOCUS_EDITOR_EVENT, onFocusEditor);
            document.removeEventListener(BLUR_EDITOR_EVENT, onBlurEditor);
        };
    }, [editorId, editorWrapperRef, isReadonly]);
};

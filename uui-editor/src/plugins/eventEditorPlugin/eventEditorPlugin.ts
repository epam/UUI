import { MutableRefObject, useEffect } from 'react';
import { createPluginFactory, eventEditorActions, eventEditorSelectors, KEY_EVENT_EDITOR, PlatePlugin } from '@udecode/plate-common';
import { uuiMod } from '@epam/uui-core';
import { FOCUS_EDITOR_EVENT, BLUR_EDITOR_EVENT } from './constants';

// TODO: move to plate
export const createEventEditorPlugin = (): PlatePlugin => {
    const createPlugin = createPluginFactory({
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
    return createPlugin();
};

export const useFocusEvents = ({
    editorWrapperRef,
    editorId,
    isReadonly,
}: {
    editorId: string,
    isReadonly?: boolean,
    editorWrapperRef: MutableRefObject<HTMLDivElement | undefined>
}) => {
    useEffect(() => {
        const onFocusEditor = (event: Event) => {
            const id = (event as any).detail.id;
            const allowFocus = editorWrapperRef.current && !isReadonly && editorId === id;
            if (allowFocus && editorWrapperRef.current) {
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

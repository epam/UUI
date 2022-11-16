import { useEffect, useState } from 'react';
import {
    isSelectionExpanded,
    useEditorState,
    useEventEditorSelectors,
    getSelectionBoundingClientRect,
    usePopperPosition,
    UsePopperPositionOptions,
    PlateEditor,
} from '@udecode/plate';
import { useFocused } from 'slate-react';

/**
 * Get bounding client rect of the window selection
 */
const getSelectionBoundingClientRect1 = (): any => {
    return {
        width: 0,
        height: 0,
        x: 100,
        y: 100,
        top: 100,
        left: 100,
        right: 100,
        bottom: 100,
    };
};

const isSelectedImage = (editor: PlateEditor): boolean => {
    const fragment = editor?.getFragment() || [];

    return fragment.some(fr => fr.type === 'image');
};

export const useBalloonToolbarPopper = (options: UsePopperPositionOptions) => {
    const focusedEditorId = useEventEditorSelectors.focus();
    const editor = useEditorState();
    const focused = useFocused();

    const [isHidden, setIsHidden] = useState(false);

    const selectionImage = editor && isSelectedImage(editor);

    useEffect(() => {
        if (
            !selectionImage ||
            !focused ||
            editor.id !== focusedEditorId
        ) {
            setIsHidden(true);
        } else  if (selectionImage) {
            setIsHidden(false);
        }
    }, [
        editor.id,
        editor.selection,
        focused,
        focusedEditorId,
        selectionImage,
    ]);

    const popperResult = usePopperPosition({
        isHidden,
        getBoundingClientRect: getSelectionBoundingClientRect,
        ...options,
    });

    const { update } = popperResult;

    useEffect(() => {
        if (selectionImage) {
            update?.();
        }
    }, [selectionImage, update]);

    return popperResult;
};
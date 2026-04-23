import { findNode, isExpanded, toDOMNode, toDOMRange } from '@udecode/plate-common';
import { getCellTypes } from '@udecode/plate-table';
import { Range } from 'slate';
import { useEditorState } from '@udecode/plate-common';
import type { VirtualElement } from '@floating-ui/react';

const toVirtualElement = (target: VirtualElement): VirtualElement => {
    const boundingRect = target.getBoundingClientRect();
    const clientRects = target.getClientRects();

    return {
        getBoundingClientRect: () => boundingRect,
        getClientRects: () => clientRects,
    };
};

export const getVirtualReferenceElement = (editor: ReturnType<typeof useEditorState>, { isTable }: { isTable?: boolean }): VirtualElement | null => {
    if (isTable) {
        const [selectedNode] = findNode(editor, {
            at: Range.start(editor.selection),
            match: { type: getCellTypes(editor) },
        });

        const domNode = toDOMNode(editor, selectedNode);

        if (!domNode) {
            return null;
        }

        return toVirtualElement(domNode);
    }

    if (!isExpanded(editor.selection)) {
        return null;
    }

    const range = toDOMRange(editor, editor.selection);

    if (!range) {
        return null;
    }

    return toVirtualElement(range);
};

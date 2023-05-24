import {
    PlateEditor,
    withoutNormalizing,
    isAcrossListItems,
    getEndPoint,
    getAboveNode,
    getPluginType,
    ELEMENT_LI,
    hasListChild,
    createPathRef,
    getStartPoint,
    getParentNode,
    getHighestEmptyList,
    removeNodes,
    Value,
} from "@udecode/plate";
import { Range } from "slate";

export const deleteFragmentList = <V extends Value>(editor: PlateEditor<V>) => {
    let deleted = false;
    console.log('call delete fragment list');


    withoutNormalizing(editor, () => {
        // Selection should be across list items
        if (!isAcrossListItems(editor)) return;

        /**
         * Check if the end li can be deleted (if it has no sublist).
         * Store the path ref to delete it after deleteMerge.
         */
        const end = getEndPoint(editor, editor.selection as Range);
        const liEnd = getAboveNode(editor, {
            at: end,
            match: { type: getPluginType(editor, ELEMENT_LI) },
        });
        const liEndCanBeDeleted = liEnd && !hasListChild(editor, liEnd[0]);
        const liEndPathRef = liEndCanBeDeleted
            ? createPathRef(editor, liEnd![1])
            : undefined;

        /**
         * Delete fragment and move end block children to start block
         */
        // TODO: improve on plate side
        // deleteMerge(editor);

        const start = getStartPoint(editor, editor.selection as Range);
        const liStart = getAboveNode(editor, {
            at: start,
            match: { type: getPluginType(editor, ELEMENT_LI) },
        });

        if (liEndPathRef) {
            const liEndPath = liEndPathRef.unref()!;

            const listStart = liStart && getParentNode(editor, liStart[1]);

            const deletePath = getHighestEmptyList(editor, {
                liPath: liEndPath,
                diffListPath: listStart?.[1],
            });

            if (deletePath) {
                removeNodes(editor, { at: deletePath });
            }

            deleted = true;
        }
    });

    return deleted;
};

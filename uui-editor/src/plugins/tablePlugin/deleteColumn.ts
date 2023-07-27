import {
    PlateEditor,
    getPluginType,
    someNode,
    getAboveNode,
    withoutNormalizing,
    TDescendant,
    removeNodes,
    setNodes,
    Value,
} from "@udecode/plate-common";
import {
    ELEMENT_TABLE,
    ELEMENT_TD,
    ELEMENT_TH,
    ELEMENT_TR,
    TTableElement,
} from "@udecode/plate-table"

export const deleteColumn = <V extends Value>(editor: PlateEditor<V>) => {
    if (
        someNode(editor, {
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        })
    ) {
        const tdEntry = getAboveNode(editor, {
            match: {
                type: [
                    getPluginType(editor, ELEMENT_TD),
                    getPluginType(editor, ELEMENT_TH),
                ],
            },
        });
        const trEntry = getAboveNode(editor, {
            match: { type: getPluginType(editor, ELEMENT_TR) },
        });
        const tableEntry = getAboveNode<TTableElement>(editor, {
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        });

        if (
            tdEntry &&
            trEntry &&
            tableEntry &&
            // Cannot delete the last cell
            trEntry[0].children.length > 1
        ) {
            const [tableNode, tablePath] = tableEntry;

            // TODO: check entire column. if there are cells with colSpan > 1.
            // Then we need to remove squize that column or divide into two smaller once.
            // It depends on particular case.
            // Use colIndex assigned from uui-editor/src/plate/plugins/tablePlugin/util.ts
            const tdPath = tdEntry[1];
            const colIndex = tdPath[tdPath.length - 1];

            const pathToDelete = tdPath.slice();
            const replacePathPos = pathToDelete.length - 2;

            withoutNormalizing(editor, () => {
                tableEntry[0].children.forEach(
                    (_: TDescendant, rowIdx: number) => {
                        pathToDelete[replacePathPos] = rowIdx;

                        removeNodes(editor, {
                            at: pathToDelete,
                        });
                    }
                );

                const { colSizes } = tableNode;

                if (colSizes) {
                    const newColSizes = [...colSizes];
                    newColSizes.splice(colIndex, 1);

                    setNodes<TTableElement>(
                        editor,
                        { colSizes: newColSizes },
                        { at: tablePath }
                    );
                }
            });
        }
    }
};

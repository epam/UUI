import { PlateEditor, findNode, getPluginType, getBlockAbove, getPluginOptions, withoutNormalizing, insertElements, TElement, select, Value } from '@udecode/plate-common';
import { ELEMENT_TR, ELEMENT_TABLE, TablePlugin, getEmptyRowNode, getCellTypes } from '@udecode/plate-table';
import { Path } from 'slate';
import { getRowSpan, getTableColumnCount } from './utils';
import { ExtendedTTableCellElement } from './types';

export const insertTableRow = <V extends Value>(
    editor: PlateEditor<V>,
    {
        header,
        fromRow,
        at,
        disableSelect,
    }: {
        header?: boolean;
        fromRow?: Path;
        /**
       * Exact path of the row to insert the column at.
       * Will overrule `fromRow`.
       */
        at?: Path;
        disableSelect?: boolean;
    } = {},
) => {
    const trEntry = fromRow
        ? findNode(editor, {
            at: fromRow,
            match: { type: getPluginType(editor, ELEMENT_TR) },
        })
        : getBlockAbove(editor, {
            match: { type: getPluginType(editor, ELEMENT_TR) },
        });
    if (!trEntry) return;

    const [, trPath] = trEntry;

    const tableEntry = getBlockAbove(editor, {
        match: { type: getPluginType(editor, ELEMENT_TABLE) },
        at: trPath,
    });
    if (!tableEntry) return;

    const { newCellChildren } = getPluginOptions<TablePlugin, V>(
        editor,
        ELEMENT_TABLE,
    );

    const [cellNode] = findNode(editor, {
        at: fromRow,
        match: { type: getCellTypes(editor) },
    });
    const cellElement = cellNode as ExtendedTTableCellElement;
    const rowSpan = getRowSpan(cellElement);

    // consider merged cell with rowSpan > 1
    const rowIndex = trPath.at(-1);
    const updateTrPath = [...trPath.slice(0, -1), rowIndex + rowSpan - 1];

    withoutNormalizing(editor, () => {
        insertElements(
            editor,
            getEmptyRowNode(editor, {
                header,
                colCount: getTableColumnCount(tableEntry[0] as TElement),
                newCellChildren,
            }),
            {
                at: Path.isPath(at) ? at : Path.next(updateTrPath),
            },
        );
    });

    if (!disableSelect) {
        const cellEntry = getBlockAbove(editor, {
            match: { type: getCellTypes(editor) },
        });
        if (!cellEntry) return;

        const [, nextCellPath] = cellEntry;
        if (Path.isPath(at)) {
            nextCellPath[nextCellPath.length - 2] = at.at(-2)!;
        } else {
            nextCellPath[nextCellPath.length - 2] += 1;
        }

        select(editor, nextCellPath);
    }
};

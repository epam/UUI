import {
    findNode,
    findNodePath,
    getBlockAbove,
    getParentNode,
    getPluginOptions,
    getPluginType,
    insertElements,
    PlateEditor,
    setNodes,
    TDescendant,
    TElement,
    Value,
    withoutNormalizing,
} from '@udecode/plate-common';
import { ELEMENT_TABLE, ELEMENT_TH, getCellTypes, getEmptyCellNode, TablePlugin, TTableElement, TTableRowElement } from '@udecode/plate-table';
import { Path } from 'slate';
import { findCellByIndexes } from './findCellByIndexes';
import { ExtendedTTableCellElement } from './types';

const createEmptyCell = <V extends Value>(editor: PlateEditor<V>, row: TTableRowElement, newCellChildren: TDescendant[], rowSpan: number, header?: boolean) => {
    const isHeaderRow = header === undefined
        ? (row as TElement).children.every(
            (c) => c.type === getPluginType(editor, ELEMENT_TH),
        )
        : header;

    return {
        ...getEmptyCellNode(editor, {
            header: isHeaderRow,
            newCellChildren,
        }),
        rowSpan,
    };
};

export const insertTableColumn = <V extends Value>(
    editor: PlateEditor<V>,
    {
        disableSelect,
        fromCell,
        at,
        header,
    }: {
        header?: boolean;

        /**
       * Path of the cell to insert the column from.
       */
        fromCell?: Path;

        /**
       * Exact path of the cell to insert the column at.
       * Will overrule `fromCell`.
       */
        at?: Path;

        /**
       * Disable selection after insertion.
       */
        disableSelect?: boolean;
    } = {},
) => {
    const cellEntry = fromCell
        ? findNode(editor, {
            at: fromCell,
            match: { type: getCellTypes(editor) },
        })
        : getBlockAbove(editor, {
            match: { type: getCellTypes(editor) },
        });
    if (!cellEntry) return;

    const [, cellPath] = cellEntry;
    const cell = cellEntry[0] as ExtendedTTableCellElement;

    const tableEntry = getBlockAbove<TTableElement>(editor, {
        match: { type: getPluginType(editor, ELEMENT_TABLE) },
        at: cellPath,
    });
    if (!tableEntry) return;

    const { newCellChildren, initialTableWidth, minColumnWidth } = getPluginOptions<TablePlugin, V>(editor, ELEMENT_TABLE);
    const [tableNode, tablePath] = tableEntry;

    let nextCellPath: Path;
    let nextColIndex: number;
    let checkingColIndex: number;

    if (Path.isPath(at)) {
        nextCellPath = at;
        nextColIndex = cell.colIndex;
        checkingColIndex = cell.colIndex - 1;

        // nextColIndex = at.at(-1)!; // TODO: remove this
    } else {
        nextCellPath = Path.next(cellPath);
        nextColIndex = cell.colIndex + cell.colSpan;
        checkingColIndex = cell.colIndex + cell.colSpan - 1;

        // nextColIndex = cellPath.at(-1)! + 1; // TODO: remove this
    }

    const currentRowIndex = cellPath.at(-2); // recheck it
    const rowNumber = tableNode.children.length;
    const firstCol = nextColIndex <= 0;

    // const colCount = getTableColumnCount(tableNode);
    // const lastRow = nextColIndex === colCount;

    let placementCorrection = 1;
    if (firstCol) {
        checkingColIndex = 0;
        placementCorrection = 0;
    }

    const affectedCellsSet = new Set();
    Array.from({ length: rowNumber }, (_, i) => i).forEach((rI) => {
        const found = findCellByIndexes(tableNode, rI, checkingColIndex);
        affectedCellsSet.add(found);
    });
    const affectedCells = Array.from(affectedCellsSet) as ExtendedTTableCellElement[];

    affectedCells.forEach((cur) => {
        const curCell = cur as ExtendedTTableCellElement;
        const currentCellPath = findNodePath(editor, curCell);

        const endCurI = curCell.colIndex + curCell.colSpan - 1;
        if (endCurI >= nextColIndex && !firstCol) {
            // make wider
            setNodes<ExtendedTTableCellElement>(
                editor,
                { ...curCell, colSpan: curCell.colSpan + 1 },
                { at: currentCellPath },
            );
        } else {
            // add new
            const curRowPath = currentCellPath.slice(0, -1);
            const curColPath = currentCellPath.at(-1);
            const placementPath = [...curRowPath, curColPath + placementCorrection];

            const row = getParentNode(editor, currentCellPath)!;
            const rowElement = row[0] as TTableRowElement;
            const emptyCell = createEmptyCell(editor, rowElement, newCellChildren, curCell.rowSpan, header);
            insertElements(editor, emptyCell, {
                at: placementPath,
                select: !disableSelect && curCell.rowIndex === currentRowIndex,
            });
        }
    });

    withoutNormalizing(editor, () => {
        const { colSizes } = tableNode;

        if (colSizes) {
            const newColSizes = [
                ...colSizes.slice(0, nextColIndex),
                50,
                ...colSizes.slice(nextColIndex),
            ];

            setNodes<TTableElement>(
                editor,
                {
                    colSizes: newColSizes,
                },
                {
                    at: tablePath,
                },
            );
        }
    });
};

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
import { ELEMENT_TABLE, ELEMENT_TH, getCellTypes, getEmptyCellNode, getTableColumnCount, TablePlugin, TTableElement, TTableRowElement } from '@udecode/plate-table';
import { Path } from 'slate';
import { findCellByIndexes } from './findCellByIndexes';
import { ExtendedTTableCellElement } from './types';

const createEmptyCell = <V extends Value>(editor: PlateEditor<V>, row: TTableRowElement, newCellChildren: TDescendant[], header?: boolean) => {
    const isHeaderRow = header === undefined
        ? (row as TElement).children.every(
            (c) => c.type === getPluginType(editor, ELEMENT_TH),
        )
        : header;

    return getEmptyCellNode(editor, {
        header: isHeaderRow,
        newCellChildren,
    });
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

    const [selectedCell, cellPath] = cellEntry;
    const tableEntry = getBlockAbove<TTableElement>(editor, {
        match: { type: getPluginType(editor, ELEMENT_TABLE) },
        at: cellPath,
    });
    if (!tableEntry) return;
    const [tableNode, tablePath] = tableEntry;

    let nextCellPath: Path;

    if (Path.isPath(at)) {
        nextCellPath = at;
    } else {
        nextCellPath = Path.next(cellPath);
    }

    const nextCellEntry = findNode(editor, {
        at: nextCellPath, match: { type: getCellTypes(editor) },
    });
    const { newCellChildren, initialTableWidth, minColumnWidth } = getPluginOptions<TablePlugin, V>(editor, ELEMENT_TABLE);

    let nextCell: ExtendedTTableCellElement;
    let insertLastCol = false;
    let nextCellColIndex: number;
    if (!nextCellEntry) {
        const columnNumber = getTableColumnCount(tableNode);
        // nextCell = findCellByIndexes(tableNode, 0, 0);
        console.log('last column', columnNumber, nextCell);
        insertLastCol = true;
        nextCellColIndex = columnNumber - 1;

        tableNode.children.forEach((row) => {
            const rowElem = row as TTableRowElement;

            const currentCell = rowElem.children.at(-1) as ExtendedTTableCellElement;

            const cellPath = findNodePath(editor, currentCell);

            const rowPath = cellPath.slice(0, -1);
            const colPath = cellPath.at(-1);
            const placementPath = [...rowPath, colPath + 1];

            console.log('current cell', currentCell, cellPath, placementPath);

            const emptyCell = createEmptyCell(editor, rowElem, newCellChildren, header);
            insertElements(editor, emptyCell, {
                at: placementPath,
                select: !disableSelect,
            });
        });
    } else if (nextCellPath.at(-1) === 0) {
        nextCell = findCellByIndexes(tableNode, 0, 0);
        nextCellColIndex = 0;
        console.log('first column');
    } else {
        nextCell = nextCellEntry[0] as ExtendedTTableCellElement;
        console.log('nextCellColIndex', nextCellColIndex, 'at', at);

        if (Path.isPath(at)) {
            nextCellColIndex = at.at(-1)!;
        } else {
            nextCellColIndex = nextCell.colIndex + nextCell.colSpan - 1;
        }
    }

    console.log('selectedCell', selectedCell, 'nextCellPath', nextCellPath, 'nextCellEntry', nextCellEntry);

    const rowNumber = tableNode.children.length;

    if (!insertLastCol) {
        const affectedCellsSet = new Set();
        // iterating by rows is important here to keep the order of affected cells
        Array.from({ length: rowNumber }, (_, i) => i).forEach((rI) => {
            const found = findCellByIndexes(tableNode, rI, nextCellColIndex);
            affectedCellsSet.add(found);
        });
        const affectedCells = Array.from(affectedCellsSet) as ExtendedTTableCellElement[];
        console.log('affectedCells', affectedCells);

        affectedCells.forEach((cur) => {
            const currentCell = cur as ExtendedTTableCellElement;
            const currentCellPath = findNodePath(editor, currentCell);
            console.log('current cell', currentCell, currentCellPath);

            if (currentCell.colIndex < nextCell.colIndex) {
                // make wider
                setNodes<ExtendedTTableCellElement>(
                    editor,
                    { ...currentCell, colSpan: currentCell.colSpan + 1 },
                    { at: currentCellPath },
                );
            } else {
                // add new
                const row = getParentNode(editor, currentCellPath)!;
                const rowElement = row[0] as TTableRowElement;
                // console.log('row', row);
                const emptyCell = createEmptyCell(editor, rowElement, newCellChildren, header);
                insertElements(editor, emptyCell, {
                    at: currentCellPath,
                    select: !disableSelect,
                });
            }
        });
    }

    withoutNormalizing(editor, () => {
        const { colSizes } = tableNode;

        if (colSizes) {
            const newColSizes = [
                ...colSizes.slice(0, nextCellColIndex),
                50,
                ...colSizes.slice(nextCellColIndex),
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

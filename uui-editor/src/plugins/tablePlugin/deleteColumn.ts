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
    findNodePath,
    insertElements,
} from '@udecode/plate-common';
import {
    ELEMENT_TABLE,
    ELEMENT_TD,
    ELEMENT_TH,
    ELEMENT_TR,
    TTableElement,
    TTableRowElement,
    getCellTypes,
    getTableColumnCount,
} from '@udecode/plate-table';
import { ExtendedTTableCellElement } from './types';
import { findCellByIndexes } from './findCellByIndexes';
import { Path } from 'slate';

export const deleteColumn = <V extends Value>(editor: PlateEditor<V>) => {
    if (
        someNode(editor, {
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        })
    ) {
        const selectedCellEntry = getAboveNode(editor, {
            match: {
                type: getCellTypes(editor),
            },
        });
        const selectedCell = selectedCellEntry[0] as ExtendedTTableCellElement;
        const deletingColIndex = selectedCell.colIndex!;
        const colsDeleteNumber = selectedCell.colSpan!;
        const endingColIndex = deletingColIndex + colsDeleteNumber - 1;

        const tableEntry = getAboveNode<TTableElement>(editor, {
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        });
        const table = tableEntry[0] as TTableElement;

        const rowNumber = table.children.length;

        const affectedCellsSet = new Set();
        // iterating by rows is important here to keep the order of affected cells
        Array.from({ length: rowNumber }, (_, i) => i).forEach((rI) => {
            return Array.from({ length: colsDeleteNumber }, (_, i) => i).forEach((cI) => {
                const colIndex = deletingColIndex + cI;

                // console.log('current', rowIndex, cI);
                const found = findCellByIndexes(table, rI, colIndex);
                affectedCellsSet.add(found);
            });
        });
        const affectedCells = Array.from(affectedCellsSet) as ExtendedTTableCellElement[];
        console.log('affectedCells', affectedCells);

        const { moveToNextColCells, squizeColSpanCells } = affectedCells.reduce((acc, cur) => {
            if (!cur) return acc;

            const currentCell = cur as ExtendedTTableCellElement;

            if (currentCell.colIndex < deletingColIndex && currentCell.colSpan > 1) {
                acc.squizeColSpanCells.push(currentCell);
            } else if (
                currentCell.colSpan > 1
                && (currentCell.colIndex + currentCell.colSpan - 1) > endingColIndex
            ) {
                acc.moveToNextColCells.push(currentCell);
            }
            return acc;
        }, { moveToNextColCells: [], squizeColSpanCells: [] });

        console.log('moveToNextColCells', moveToNextColCells);

        const nextColIndex = deletingColIndex + colsDeleteNumber;

        const colNumber = getTableColumnCount(table);

        if (colNumber > nextColIndex) {
            moveToNextColCells.forEach((cur) => {
                const curCell = cur as ExtendedTTableCellElement;

                const curRow = table.children[curCell.rowIndex] as TTableRowElement;
                const startingCellIndex = curRow.children.findIndex((curC) => {
                    const cell = curC as ExtendedTTableCellElement;
                    return cell.colIndex >= (curCell.colIndex + 1);
                });

                const startingCell = curRow.children[startingCellIndex];

                const startingCellPath = findNodePath(editor, startingCell);

                const colsNumberAffected = endingColIndex - curCell.colIndex + 1;
                console.log('curCell', curCell, 'endingColIndex', endingColIndex, 'startingCellIndex', startingCellIndex, 'colsNumberAffected', colsNumberAffected);

                const newCell = { ...curCell, colSpan: curCell.colSpan - colsNumberAffected };
                insertElements(editor, newCell, { at: startingCellPath });
            });
        }

        console.log('squizeColSpanCells', squizeColSpanCells);

        squizeColSpanCells.forEach((cur) => {
            const curCell = cur as ExtendedTTableCellElement;
            const curCellPath = findNodePath(editor, curCell)!;

            const curCellEndingColIndex = Math.min(curCell.colIndex + curCell.colSpan - 1, endingColIndex);
            const colsNumberAffected = curCellEndingColIndex - deletingColIndex + 1;

            console.log('curCell', curCell, 'colsNumberAffected', colsNumberAffected);
            setNodes<ExtendedTTableCellElement>(
                editor,
                { ...curCell, colSpan: curCell.colSpan - colsNumberAffected },
                { at: curCellPath },
            );
        });

        const trEntry = getAboveNode(editor, {
            match: { type: getPluginType(editor, ELEMENT_TR) },
        });

        if (
            selectedCell
            && trEntry
            && tableEntry
            // Cannot delete the last cell
            && trEntry[0].children.length > 1
        ) {
            const [tableNode, tablePath] = tableEntry;

            // calc paths to delete
            const paths: Array<Path[]> = [];
            affectedCells.forEach((cur) => {
                const curCell = cur as ExtendedTTableCellElement;

                if (curCell.colIndex >= deletingColIndex && curCell.colIndex <= endingColIndex) {
                    const cellPath = findNodePath(editor, curCell);

                    if (!paths[curCell.rowIndex]) {
                        paths[curCell.rowIndex] = [];
                    }
                    paths[curCell.rowIndex].push(cellPath);
                }
            });

            // console.log('paths', paths);

            withoutNormalizing(editor, () => {
                paths.forEach((cellPaths) => {
                    const pathToDelete = cellPaths[0];
                    cellPaths.forEach(() => {
                        // console.log('removing', pathToDelete);
                        removeNodes(editor, {
                            at: pathToDelete,
                        });
                    });
                });

                const { colSizes } = tableNode;
                if (colSizes) {
                    const newColSizes = [...colSizes];
                    newColSizes.splice(deletingColIndex, 1);

                    setNodes<TTableElement>(
                        editor,
                        { colSizes: newColSizes },
                        { at: tablePath },
                    );
                }
            });
        }
    }
};

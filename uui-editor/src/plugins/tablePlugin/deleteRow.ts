import {
    findNodePath,
    getAboveNode,
    getParentNode,
    getPluginType,
    insertElements,
    PlateEditor,
    removeNodes,
    setNodes,
    someNode,
    Value,
} from '@udecode/plate-common';
import { ELEMENT_TABLE, TTableElement, getCellTypes, TTableRowElement, TTableCellElement } from '@udecode/plate-table';
import { ExtendedTTableCellElement } from './types';
import { findCellByIndexes } from './findCellByIndexes';
import { getTableColumnCount } from './utils';

export const deleteRow = <V extends Value>(editor: PlateEditor<V>) => {
    if (
        someNode(editor, {
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        })
    ) {
        const currentTableItem = getAboveNode<TTableElement>(editor, {
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        });
        const table = currentTableItem[0] as TTableElement;

        const selectedCellEntry = getAboveNode(editor, {
            match: { type: getCellTypes(editor) },
        });

        const selectedCell = selectedCellEntry[0] as ExtendedTTableCellElement;
        const deletingRowIndex = selectedCell.rowIndex!;
        const rowsDeleteNumber = selectedCell.rowSpan!;

        const endingRowIndex = deletingRowIndex + rowsDeleteNumber - 1;

        const colNumber = getTableColumnCount(table);

        const affectedCellsSet = new Set();
        Array.from({ length: colNumber }, (_, i) => i).forEach((cI) => {
            return Array.from({ length: rowsDeleteNumber }, (_, i) => i).forEach((rI) => {
                const rowIndex = deletingRowIndex + rI;

                // console.log('current', rowIndex, cI);
                const found = findCellByIndexes(table, rowIndex, cI);
                affectedCellsSet.add(found);
            });
        });
        const affectedCells = Array.from(affectedCellsSet) as ExtendedTTableCellElement[];
        // console.log('affectedCells', affectedCells);

        const { moveToNextRowCells, squizeRowSpanCells } = affectedCells.reduce((acc, cur) => {
            if (!cur) return acc;

            const currentCell = cur as ExtendedTTableCellElement;
            // console.log('current', currentCell, currentCell.rowIndex + currentCell.rowSpan - 1, deletingRowIndex);
            if (currentCell.rowIndex < deletingRowIndex && currentCell.rowSpan > 1) {
                acc.squizeRowSpanCells.push(currentCell);
            } else if (
                currentCell.rowSpan > 1
                && (currentCell.rowIndex + currentCell.rowSpan - 1) > endingRowIndex
                // && (currentCell.rowIndex + currentCell.rowSpan - 1) >= deletingRowIndex
            ) {
                acc.moveToNextRowCells.push(currentCell);
            }

            return acc;
        }, { squizeRowSpanCells: [], moveToNextRowCells: [] });

        // console.log('moveToNextRowCells', moveToNextRowCells);

        const nextRowIndex = deletingRowIndex + rowsDeleteNumber;
        const nextRow = table.children[nextRowIndex] as TTableCellElement | undefined;

        if (nextRow) {
            // console.log('nextRow', nextRow);
            moveToNextRowCells.forEach((cur) => {
                const curRowCell = cur as ExtendedTTableCellElement;

                const startingCellIndex = nextRow.children.findIndex((curC) => {
                    const cell = curC as ExtendedTTableCellElement;
                    return cell.colIndex >= curRowCell.colIndex;
                });
                let startingCell: ExtendedTTableCellElement;
                if (startingCellIndex === -1) {
                    startingCell = nextRow.children.at(-1) as ExtendedTTableCellElement;
                } else {
                    startingCell = nextRow.children[startingCellIndex] as ExtendedTTableCellElement;
                }

                const startingCellPath = findNodePath(editor, startingCell);
                const tablePath = startingCellPath.slice(0, -2);
                const colPath = startingCellPath.at(-1);

                const nextRowStartCellPath = [...tablePath, nextRowIndex, colPath];
                // console.log('startingCell', startingCell, 'startingCellPath', startingCellPath, 'nextRowStartCellPath', nextRowStartCellPath);

                const curCellStartingRowIndex = curRowCell.rowIndex;
                const rowsNumberAffected = endingRowIndex - curCellStartingRowIndex + 1;
                // console.log('curRowCell', curRowCell, 'curCellStartingRowIndex', curCellStartingRowIndex, 'endingRowIndex', endingRowIndex, 'rowsNumberAffected', rowsNumberAffected);

                // TODO: consider make deep clone here
                // making cell smaller and moving it to next row
                const newCell = { ...curRowCell, rowSpan: curRowCell.rowSpan - rowsNumberAffected };
                insertElements(editor, newCell, { at: nextRowStartCellPath });
            });
        }

        console.log('squizeRowSpanCells', squizeRowSpanCells);

        squizeRowSpanCells.forEach((cur) => {
            const curRowCell = cur as ExtendedTTableCellElement;
            const curCellPath = findNodePath(editor, curRowCell)!;

            const curCellEndingRowIndex = Math.min(curRowCell.rowIndex + curRowCell.rowSpan - 1, endingRowIndex);
            const rowsNumberAffected = curCellEndingRowIndex - deletingRowIndex + 1;
            // console.log('curCellEndingRowIndex', curCellEndingRowIndex, 'deletingRowIndex', deletingRowIndex, 'rowsNumberAffected', rowsNumberAffected);

            setNodes<ExtendedTTableCellElement>(
                editor,
                { ...curRowCell, rowSpan: curRowCell.rowSpan - rowsNumberAffected },
                { at: curCellPath },
            );
        });

        const rowToDelete = table.children[deletingRowIndex] as TTableRowElement;
        if (
            rowToDelete
            // Cannot delete the last row
            && rowToDelete.children.length > 1
        ) {
            const rowPath = findNodePath(editor, rowToDelete);
            console.log('starting row to delete', rowToDelete, 'at path', rowPath, 'times', rowsDeleteNumber);
            Array.from({ length: rowsDeleteNumber }).forEach(() => {
                removeNodes(editor, {
                    at: rowPath,
                });
            });
        }
    }
};

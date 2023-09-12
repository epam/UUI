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
                affectedCellsSet.add(findCellByIndexes(table, rowIndex, cI));
            });
        });
        const affectedCells = Array.from(affectedCellsSet) as ExtendedTTableCellElement[];
        // console.log('affectedCells', affectedCells);

        const { moveToNextRowCells, squizeRowSpanCells } = affectedCells.reduce((acc, cur) => {
            if (!cur) return acc;

            const currentCell = cur as ExtendedTTableCellElement;
            if (currentCell.rowIndex < deletingRowIndex && currentCell.rowSpan > 1) {
                acc.squizeRowSpanCells.push(currentCell);
            } else if (
                currentCell.rowSpan > 1
                && (currentCell.rowIndex + currentCell.rowSpan - 1) > endingRowIndex
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
                const curCellPath = findNodePath(editor, curRowCell)!;
                const tablePath = curCellPath.slice(0, -2);

                const nextRowStartCellPath = [...tablePath, nextRowIndex, curRowCell.colIndex];
                // console.log('curRowCell', curRowCell, curCellPath, nextRowIndex, curRowCell.colIndex);

                // TODO: consider make deep clone here
                // making cell smaller and moving it to next row
                const newCell = { ...curRowCell, rowSpan: curRowCell.rowSpan - rowsDeleteNumber };
                insertElements(editor, newCell, { at: nextRowStartCellPath });
            });
        }

        console.log('squizeRowSpanCells', squizeRowSpanCells);

        squizeRowSpanCells.forEach((cur) => {
            const curRowCell = cur as ExtendedTTableCellElement;
            const curCellPath = findNodePath(editor, curRowCell)!;

            const curCellEndingRowIndex = curRowCell.rowIndex + curRowCell.rowSpan - 1;
            const rowsNumberAffected = curCellEndingRowIndex - deletingRowIndex + 1;
            // console.log('curCellEndingRowIndex', curCellEndingRowIndex, 'rowsNumberAffected', rowsNumberAffected);

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

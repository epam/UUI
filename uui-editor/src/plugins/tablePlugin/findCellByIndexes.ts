import { TTableElement } from '@udecode/plate-table';
import { ExtendedTTableCellElement } from './types';

export const findCellByIndexes = (
    table: TTableElement,
    searchRowIndex: number,
    searchColIndex: number,
) => {
    const rows = table.children;

    const allCells = rows.flatMap((current) => current.children) as ExtendedTTableCellElement[];

    // console.log('allCells', allCells);

    // console.log('current search', searchRowIndex, searchColIndex);
    const foundCell = allCells.find((cell) => {
        const colIndex = cell.colIndex;
        const endColIndex = cell.colIndex + cell.colSpan - 1;
        const rowIndex = cell.rowIndex;
        const endRowIndex = cell.rowIndex + cell.rowSpan - 1;

        // console.log('current', rowIndex, endRowIndex, colIndex, endColIndex);

        if (
            searchColIndex >= colIndex
            && searchColIndex <= endColIndex
            && searchRowIndex >= rowIndex
            && searchRowIndex <= endRowIndex
        ) {
            // console.log('found unbelievable cell', cell);
            return true;
        }

        return false;
    });

    return foundCell;
};

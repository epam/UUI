import {
    TTableCellElement,
    TTableElement,
    TTableRowElement,
} from "@udecode/plate";
import { ExtendedTTableCellElement } from "./types";

export const updateTableStructure = (tableElem: TTableElement) => {
    const structure: number[][][] = [];
    let shifts: number[][] = [];
    let hShifts: number[][] = [];

    tableElem.children.forEach((cur, rowIndex) => {
        const rowElem = cur as TTableRowElement;
        structure[rowIndex] = [];

        rowElem.children.forEach((current, colIndex) => {
            const cellElem = current as ExtendedTTableCellElement;
            let colIndexToSet = colIndex;

            // shifts caused by [rowSpan]
            // decide which index to assign depending on col shifts
            if (!!shifts.length) {
                shifts.forEach((sh, i) => {
                    if (!sh.length) return;

                    // - is it valid shift for this column
                    // - depth still valid for this row
                    // - applied only to next rows
                    // then shift current col index
                    if (sh[0] <= colIndex && sh[1] >= 2 && rowIndex > sh[2]) {
                        const colSpan = sh[3];
                        colIndexToSet = colIndexToSet + colSpan;
                    }
                });
            }

            // shifts caused by [colSpan]
            if (!!hShifts.length) {
                hShifts.forEach((hSh, i) => {
                    if (!hSh.length) return;

                    // - is it valid shift for this column
                    // - is it valid shift for this row
                    if (hSh[0] <= colIndex && i === rowIndex) {
                        colIndexToSet = colIndexToSet + (hSh[1] - 1);
                    }
                });
            }

            // assign col index
            if (cellElem.data?.colSpan > 1) {
                // shift caused by [colSpan] of the currently merged cell
                colIndexToSet = cellElem.data?.colSpan - 1 + colIndexToSet;

                structure[rowIndex][colIndex] = [
                    colIndexToSet,
                    cellElem.data?.colSpan,
                ];
            } else {
                structure[rowIndex][colIndex] = [colIndexToSet];
            }

            // update vertical shifts caused by [rowSpan]
            if (cellElem.data?.rowSpan > 1) {
                const shiftFrom = colIndex;
                const shiftRowDepth = cellElem?.data?.rowSpan; // vertical depth to shift

                if (shifts[colIndex]) {
                    // count up here if already exists
                    shifts[colIndex] = [
                        shiftFrom,
                        shifts[colIndex][1] + shiftRowDepth,
                        shifts[colIndex][2],
                        cellElem?.data.colSpan,
                    ];
                } else {
                    // create shift
                    shifts[colIndex] = [shiftFrom, shiftRowDepth, rowIndex, cellElem?.data.colSpan];
                }
            }

            // update horizontal shifts caused by [colSpan]
            if (cellElem.data?.colSpan > 1) {
                const shiftFrom = colIndex;
                const shiftLength = cellElem?.data.colSpan; // cells number to shift
                hShifts[rowIndex] = [shiftFrom, shiftLength];
            }
        });

        // count down vertical shifts
        shifts.map((sh) => {
            if (!sh?.length) {
                return;
            }
            // [rowSpan] depth ended
            if (sh[1] < 2) {
                return;
            }

            // skip count down when row hasn't changed yet
            // (basically skipping first iteration here)
            if (sh[2] < rowIndex) {
                return [sh[0], --sh[1]];
            }
            return sh;
        });
    });

    tableElem.children.forEach((curRow, rowIndex) => {
        const rowElem = curRow as TTableRowElement;

        rowElem.children.forEach((curCell, colIndex) => {
            const cellElem = curCell as TTableCellElement;
            cellElem.colIndex = structure[rowIndex][colIndex][0];
        });
    });

    return tableElem;
};

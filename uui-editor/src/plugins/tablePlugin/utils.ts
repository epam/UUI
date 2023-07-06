
import { ExtendedTTableCellElement } from "./types";
import { DEFAULT_COL_WIDTH } from "./constants";
import { PlateEditor, getPluginType } from "@udecode/plate-core";
import { TTableElement, TTableRowElement, TTableCellElement, ELEMENT_TABLE, ELEMENT_TR, ELEMENT_TH, ELEMENT_TD } from "@udecode/plate-table";
import { getStartPoint } from "@udecode/slate";
import { getBlockAbove, insertElements, createNode } from "@udecode/slate-utils";
import { selectEditor } from "@udecode/plate-utils";

export const getRowSpan = (cellElem: ExtendedTTableCellElement) => {
    const attrRowSpan = isNaN((cellElem?.attributes as any)?.rowspan)
        ? undefined
        : Number((cellElem?.attributes as any)?.rowspan);

    return attrRowSpan || cellElem.data?.rowSpan || cellElem.rowSpan || 1;
};

export const getColSpan = (cellElem: ExtendedTTableCellElement) => {
    const attrColSpan = isNaN((cellElem?.attributes as any)?.colspan)
        ? undefined
        : Number((cellElem?.attributes as any)?.colspan);

    return attrColSpan || cellElem.data?.colSpan || cellElem.colSpan || 1;
};

export const updateTableStructure = (tableElem: TTableElement) => {
    const structure: number[][][] = [];
    let shifts: number[][] = [];
    let hShifts: number[][] = [];

    tableElem.children.forEach((cur, rowIndex) => {
        const rowElem = cur as TTableRowElement;
        structure[rowIndex] = [];

        rowElem.children.forEach((current, colIndex) => {
            const cellElem = current as ExtendedTTableCellElement;
            const cellColSpan = getColSpan(cellElem);
            const cellRowSpan = getRowSpan(cellElem);
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
            if (cellColSpan > 1) {
                // shift caused by [colSpan] of the currently merged cell
                colIndexToSet = cellColSpan - 1 + colIndexToSet;

                structure[rowIndex][colIndex] = [colIndexToSet, cellColSpan];
            } else {
                structure[rowIndex][colIndex] = [colIndexToSet];
            }

            // update vertical shifts caused by [rowSpan]
            if (cellRowSpan > 1) {
                const shiftFrom = colIndex;
                const shiftRowDepth = cellRowSpan; // vertical depth to shift

                const hasActualShift = shifts[colIndex]?.length;
                if (hasActualShift) {
                    // count up here if already exists
                    shifts[colIndex] = [
                        shiftFrom,
                        shifts[colIndex][1] + shiftRowDepth,
                        shifts[colIndex][2],
                        cellColSpan,
                    ];
                } else {
                    // create shift
                    shifts[colIndex] = [
                        shiftFrom,
                        shiftRowDepth,
                        rowIndex,
                        cellColSpan,
                    ];
                }
            }

            // update horizontal shifts caused by [colSpan]
            if (cellColSpan > 1) {
                const shiftFrom = colIndex;
                const shiftLength = cellColSpan; // cells number to shift
                hShifts[rowIndex] = [shiftFrom, shiftLength];
            }
        });

        // count down vertical shifts
        shifts.forEach((sh, index) => {
            if (!sh?.length) {
                return;
            }

            // [rowSpan] depth ended
            if (sh[1] < 2) {
                shifts[index] = [];
            }

            // skip count down when row hasn't changed yet
            // (basically skipping first iteration here)
            if (sh[2] < rowIndex) {
                --sh[1];
            }
        });
    });

    tableElem.children.forEach((curRow, rowIndex) => {
        const rowElem = curRow as TTableRowElement;

        rowElem.children.forEach((curCell, colIndex) => {
            const cellElem = curCell as TTableCellElement;
            cellElem.colIndex = structure[rowIndex][colIndex][0];
            cellElem.rowIndex = rowIndex;
        });
    });

    return tableElem;
};

export const createCell = ({
    colSpan = 1,
    rowSpan = 1,
    type = "table_cell",
    textContent = "",
}: {
    type: string;
    colSpan?: number;
    rowSpan?: number;
    textContent?: string;
}) => {
    return {
        data: { colSpan, rowSpan },
        type,
        children: [
            {
                data: {},
                type: "paragraph",
                children: [{ text: textContent }],
            },
        ],
    };
};

export const selectFirstCell = (editor: PlateEditor) => {
    if (editor.selection) {
        const tableEntry = getBlockAbove(editor, {
            match: { type: getPluginType(editor, ELEMENT_TABLE) },
        });
        if (!tableEntry) return;

        const startPoint = getStartPoint(editor, tableEntry[1]);
        selectEditor(editor, { at: startPoint });

        const [tablePosition] = getStartPoint(editor, tableEntry[1]).path;
        insertElements(editor, createNode(), {
            at: [tablePosition + 1],
            select: false,
        });
    }
};

export const createInitialTable = (editor: PlateEditor) => {
    const rows = [
        {
            type: getPluginType(editor, ELEMENT_TR),
            children: [
                {
                    type: getPluginType(editor, ELEMENT_TH),
                    children: [editor.blockFactory()],
                },
                {
                    type: getPluginType(editor, ELEMENT_TH),
                    children: [editor.blockFactory()],
                },
            ],
        },
        {
            type: getPluginType(editor, ELEMENT_TR),
            children: [
                {
                    type: getPluginType(editor, ELEMENT_TD),
                    children: [editor.blockFactory()],
                },
                {
                    type: getPluginType(editor, ELEMENT_TD),
                    children: [editor.blockFactory()],
                },
            ],
        },
    ];

    return {
        type: getPluginType(editor, ELEMENT_TABLE),
        children: rows,
        data: { cellSizes: [DEFAULT_COL_WIDTH, DEFAULT_COL_WIDTH] },
    };
};

import { TTableCellElement } from "@udecode/plate";

export type ExtendedTTableCellElement = TTableCellElement & {
    rowSpan?: number;
    colIndex?: number;
    rowIndex?: number;
    data: {
        colSpan?: number;
        rowSpan?: number;
        colIndex?: number;
    }
}

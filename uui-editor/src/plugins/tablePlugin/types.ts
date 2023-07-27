import { TTableCellElement } from "@udecode/plate-table";

export type ExtendedTTableCellElement = TTableCellElement & {
    rowSpan?: number;
    colIndex?: number;
    rowIndex?: number;
    data: {
        colSpan?: number;
        rowSpan?: number;
        colIndex?: number;
    },
    attributes?: {
        colspan?: number;
        rowspan?: number;
    }
}

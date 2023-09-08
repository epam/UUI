import { TTableCellElement } from '@udecode/plate-table';

export type ExtendedTTableCellElement = TTableCellElement & {
    rowSpan?: number;
    startColIndex?: number;
    colIndex?: number;
    rowIndex?: number;
    dummy?: boolean;
    data: {
        colSpan?: number;
        rowSpan?: number;
        colIndex?: number;
    },
    attributes?: {
        colspan?: number;
        rowspan?: number;
    }
};

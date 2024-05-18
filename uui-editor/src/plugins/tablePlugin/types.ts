import { TTableCellElement, TTableElement } from '@udecode/plate-table';

export type ExtendedTTableElement = TTableElement & {
    data?: {
        cellSizes?: number[];
        version?: string;
    },
};

export type ExtendedTTableCellElement = TTableCellElement & {
    data?: {
        colSpan?: number;
        rowSpan?: number;
        version?: string;
    },
    attributes?: {
        colspan?: number;
        rowspan?: number;
    }
};

import { TTableCellElement } from '@udecode/plate-table';

export type ExtendedTTableCellElement = TTableCellElement & {
    data?: {
        colSpan?: number;
        rowSpan?: number;
    },
    attributes?: {
        colspan?: number;
        rowspan?: number;
    }
};

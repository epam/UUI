import { DataTableCellProps } from "@epam/uui-core";

export interface CopyCheckParams {
    startColumnIndex: number;
    startRowIndex: number;
    columnIndex: number;
    rowIndex: number;
    allowedDirection: DataTableCellProps["acceptReplication"];
}

export const canReplicateByDirection = ({ startColumnIndex, startRowIndex, columnIndex, rowIndex, allowedDirection }: Omit<CopyCheckParams, 'canCopy'>) => {
    if (!allowedDirection) {
        return false;
    }

    if (allowedDirection === 'horizontal' && startRowIndex !== rowIndex) {
        return false;
    }

    if (allowedDirection === 'vertical' && startColumnIndex !== columnIndex) {
        return false;
    }

    return true;
};

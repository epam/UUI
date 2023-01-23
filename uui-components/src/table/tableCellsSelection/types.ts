import { DataColumnProps, DataRowProps, ILens, SelectedCellData } from "@epam/uui-core";
import { Dispatch, SetStateAction } from "react";

export interface SelectionRange {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    isCopying?: boolean;
}

export interface SelectionManagerProps<TItem, TId> {
    rows: DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
}

export interface SelectionManager<TItem = any, TId = any, TFilter = any> {
    selectionRange: SelectionRange;
    setSelectionRange: Dispatch<SetStateAction<SelectionRange>>;
    canBeSelected: (rowIndex: number, columnIndex: number, { copyFrom, copyTo }: CopyOptions) => boolean;
    getSelectedCells: () => SelectedCellData<TItem, TId, TFilter>[];
    cellToCopyFrom: SelectedCellData<TItem, TId, TFilter>;
}

export type CopyOptions =
    | { copyFrom: true; copyTo?: false; }
    | { copyFrom?: false, copyTo: true };

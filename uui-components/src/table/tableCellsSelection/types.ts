import { DataColumnProps, DataRowProps, DataTableSelectedCellData } from '@epam/uui-core';
import { Dispatch, SetStateAction } from 'react';

export interface DataTableSelectionRange {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    isCopying?: boolean;
}

export interface SelectionManagerProps<TItem, TId> {
    rowsByIndex: Map<number, DataRowProps<TItem, TId>>;
    columns: DataColumnProps<TItem, TId>[];
}

export interface SelectionManager<TItem = any, TId = any, TFilter = any> {
    selectionRange: DataTableSelectionRange;
    setSelectionRange: Dispatch<SetStateAction<DataTableSelectionRange>>;
    getSelectedCells: () => DataTableSelectedCellData<TItem, TId, TFilter>[];
    startCell: DataTableSelectedCellData<TItem, TId, TFilter>;
    getCellSelectionInfo: (
        row: number,
        column: number
    ) => {
        isSelected: boolean;
        showTopBorder: boolean;
        showRightBorder: boolean;
        showBottomBorder: boolean;
        showLeftBorder: boolean;
        canCopyFrom: boolean;
        canAcceptCopy: boolean;
        isStartCell: boolean;
    };
}

export type CopyOptions = { copyFrom: true; copyTo?: false } | { copyFrom?: false; copyTo: true };

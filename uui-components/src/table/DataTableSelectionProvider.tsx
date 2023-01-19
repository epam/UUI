import React, { FC, useEffect, useMemo, useState } from "react";
import { BaseCellData, CellData, DataTableCellProps, RowsData } from "@epam/uui-core";
import { DataTableSelectionContext, SelectionContextState } from "./DataTableSelectionContext";
import { SelectionRange, useSelectionManager } from "./useSelectionManager";

export interface DataTableSelectionProviderProps<TItem> extends React.PropsWithChildren {
    data: RowsData<TItem>;
    onCopy: (
        copyFrom: BaseCellData<TItem>,
        selectedCells: BaseCellData<TItem>[],
    ) => void;
}

export const DataTableSelectionProvider = <TItem, TId, TCellValue = any>({ onCopy, data, children }: DataTableSelectionProviderProps<TItem>) => {
    const { selectionRange, setSelectionRange, canBeSelected, getSelectedCells, cellToCopyFrom } = useSelectionManager<TItem>({ data });

    useEffect(() => {
        if (!selectionRange) {
            return;
        }

        const handlePointerUp = () => {
            if (!selectionRange) {
                return;
            }

            onCopy(cellToCopyFrom, getSelectedCells());
            setSelectionRange(null);
        };

        document.addEventListener('pointerup', handlePointerUp);
        return () => document.removeEventListener('pointerup', handlePointerUp);
    }, [selectionRange, cellToCopyFrom, getSelectedCells]);

    return <DataTableSelectionContext.Provider value={ { selectionRange, setSelectionRange, canBeSelected } }>{ children }</DataTableSelectionContext.Provider>;
};

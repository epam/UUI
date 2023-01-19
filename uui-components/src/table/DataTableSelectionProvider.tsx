import React, { FC, useEffect, useMemo, useState } from "react";
import { DataTableCellProps, RowsData } from "@epam/uui-core";
import { DataTableSelectionContext, SelectionContextState } from "./DataTableSelectionContext";
import { SelectionRange, useSelectionManager } from "./useSelectionManager";

export interface DataTableSelectionProviderProps<TItem, TId, TCellValue = any> extends React.PropsWithChildren {
    data: RowsData<TItem>;
    onCopy: (
        copy: TCellValue,
        selectedCells: DataTableCellProps<TItem, TId, TCellValue>,
    ) => void;
}

export const DataTableSelectionProvider = <TItem, TId, TCellValue = any>({ onCopy, data, children }: DataTableSelectionProviderProps<TItem, TId, TCellValue>) => {
    const { selectionRange, setSelectionRange, canBeSelected } = useSelectionManager({ data });

    useEffect(() => {
        if (!selectionRange) {
            return;
        }

        const handlePointerUp = () => {
            setSelectionRange(null);
        };

        document.addEventListener('pointerup', handlePointerUp);
        return () => document.removeEventListener('pointerup', handlePointerUp);
    }, [selectionRange]);

    return <DataTableSelectionContext.Provider value={ { selectionRange, setSelectionRange, canBeSelected } }>{ children }</DataTableSelectionContext.Provider>;
};

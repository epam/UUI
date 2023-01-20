import React, { useEffect } from "react";
import { BaseCellData, DataColumnProps, DataRowProps } from "@epam/uui-core";
import { DataTableSelectionContext, SelectionContextState } from "./DataTableSelectionContext";
import { useSelectionManager } from "./useSelectionManager";

export interface DataTableSelectionProviderProps<TItem, TId> extends React.PropsWithChildren {
    rows: DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    onCopy: (
        copyFrom: BaseCellData<TItem>,
        selectedCells: BaseCellData<TItem>[],
    ) => void;
}

export const DataTableSelectionProvider = <TItem, TId>({ onCopy, rows, columns, children }: DataTableSelectionProviderProps<TItem, TId>) => {
    const { selectionRange, setSelectionRange, canBeSelected, getSelectedCells, cellToCopyFrom } = useSelectionManager<TItem, TId>({ rows, columns });

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

    return (
        <DataTableSelectionContext.Provider value={ { selectionRange, setSelectionRange, canBeSelected } }>
            { children }
        </DataTableSelectionContext.Provider>
    );
};

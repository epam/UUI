import React, { useEffect } from "react";
import { DataColumnProps, DataRowProps, DataTableSelectedCellData } from "@epam/uui-core";
import { DataTableSelectionContext } from "./DataTableSelectionContext";
import { useSelectionManager } from "./hooks";

export interface DataTableSelectionProviderProps<TItem, TId, TFilter> extends React.PropsWithChildren {
    rows: DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    onCopy?: (copyFrom: DataTableSelectedCellData<TItem, TId, TFilter>, selectedCells: DataTableSelectedCellData<TItem, TId, TFilter>[]) => void;
}

export const DataTableSelectionProvider = <TItem, TId, TFilter>({ onCopy, rows, columns, children }: DataTableSelectionProviderProps<TItem, TId, TFilter>) => {
    const {
        selectionRange, setSelectionRange, canBeSelected, getSelectedCells, cellToCopyFrom, useCellSelectionInfo,
    } = useSelectionManager<TItem, TId, TFilter>({ rows, columns });

    useEffect(() => {
        if (!selectionRange || !onCopy) return;

        const handlePointerUp = () => {
            if (!selectionRange) return;

            onCopy?.(cellToCopyFrom, getSelectedCells());
            setSelectionRange(null);
        };

        document.addEventListener('pointerup', handlePointerUp);
        return () => document.removeEventListener('pointerup', handlePointerUp);
    }, [selectionRange, cellToCopyFrom, getSelectedCells]);

    if (!onCopy) {
        return <>{ children }</>;
    }

    return (
        <DataTableSelectionContext.Provider value={ { selectionRange, setSelectionRange, canBeSelected, useCellSelectionInfo } }>
            { children }
        </DataTableSelectionContext.Provider>
    );
};

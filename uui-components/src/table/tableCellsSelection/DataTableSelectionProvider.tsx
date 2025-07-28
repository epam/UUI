import React, { useEffect, useMemo } from 'react';
import { DataColumnProps, DataRowProps, DataTableSelectedCellData } from '@epam/uui-core';
import { DataTableSelectionContext } from './DataTableSelectionContext';
import { useSelectionManager } from './hooks';

interface DataTableSelectionProviderProps<TItem, TId, TFilter> extends React.PropsWithChildren {
    rows: DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
    onCopy?: (copyFrom: DataTableSelectedCellData<TItem, TId, TFilter>, selectedCells: DataTableSelectedCellData<TItem, TId, TFilter>[]) => void;
}

export function DataTableSelectionProvider<TItem, TId, TFilter>({
    onCopy, rows, columns, children,
}: DataTableSelectionProviderProps<TItem, TId, TFilter>) {
    const rowsByIndex = useMemo(() => {
        const rowsMap = new Map<number, DataRowProps<TItem, TId>>();
        rows.forEach((row) => {
            rowsMap.set(row.index, row);
        });
        return rowsMap;
    }, [rows]);
    
    const {
        selectionRange, setSelectionRange, getSelectedCells, startCell, getCellSelectionInfo,
    } = useSelectionManager<TItem, TId, TFilter>({ rowsByIndex, columns });

    useEffect(() => {
        if (!selectionRange || !onCopy) return;

        const handlePointerUp = () => {
            if (!selectionRange) return;

            onCopy?.(startCell, getSelectedCells());
            setSelectionRange(null);
        };

        document.addEventListener('pointerup', handlePointerUp);
        return () => document.removeEventListener('pointerup', handlePointerUp);
    }, [
        selectionRange, startCell, getSelectedCells,
    ]);

    if (!onCopy) {
        return <>{children}</>;
    }

    const value = useMemo(() => ({ selectionRange, setSelectionRange, getCellSelectionInfo }), [selectionRange, getCellSelectionInfo]);

    return <DataTableSelectionContext.Provider value={ value }>{children}</DataTableSelectionContext.Provider>;
}

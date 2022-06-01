import React, { FC, useEffect, useMemo, useState } from "react";
import { DataTableSelectionContext, SelectionContextState, SelectionRange } from "./DataTableSelectionContext";

export function DataTableSelectionProvider({ children }: Parameters<FC>[0]) {
    const [selectionRange, setSelectionRange] = useState<SelectionRange>(null);

    const value = useMemo<SelectionContextState>(() => ({ selectionRange, setSelectionRange }), [selectionRange]);

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

    return <DataTableSelectionContext.Provider value={ value }>{ children }</DataTableSelectionContext.Provider>;
}
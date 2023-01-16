import React, { FC, useEffect, useMemo, useState } from "react";
import { DataTableSelectionContext, SelectionContextState, SelectionRange } from "./DataTableSelectionContext";

export const DataTableSelectionProvider: FC<{
    children: JSX.Element[] | JSX.Element,
}> = ({ children }) => {
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
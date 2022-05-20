import { createContext, Dispatch, SetStateAction } from "react";

export interface SelectionRange {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    isCopying?: boolean;
}

export interface SelectionContextState {
    selectionRange: SelectionRange;
    setSelectionRange: Dispatch<SetStateAction<SelectionRange>>;
}

export const DataTableSelectionContext = createContext<SelectionContextState>({ selectionRange: null, setSelectionRange: null });
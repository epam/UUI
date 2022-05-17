import { createContext, Dispatch, SetStateAction } from "react";

export interface SelectionRange<Value = any> {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
}

export interface SelectionContextState {
    selectionRange: SelectionRange;
    setSelectionRange: Dispatch<SetStateAction<SelectionRange>>;
}

export const DataTableSelectionContext = createContext<SelectionContextState>({ selectionRange: null, setSelectionRange: null });
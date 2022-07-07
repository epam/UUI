import { createContext, Dispatch, SetStateAction } from "react";
import { ColumnSelectionRange } from "@epam/uui-core";

export interface SelectionContextState {
    selectionRange: ColumnSelectionRange;
    setSelectionRange: Dispatch<SetStateAction<ColumnSelectionRange>>;
}

export const DataTableSelectionContext = createContext<SelectionContextState>({ selectionRange: null, setSelectionRange: null });
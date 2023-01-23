import { createContext } from "react";
import { SelectionManager } from "./types";


export interface SelectionContextState<TItem = any, TId = any, TFilter = any> {
    selectionRange: SelectionManager<TItem, TId, TFilter>['selectionRange'];
    setSelectionRange: SelectionManager<TItem, TId, TFilter>['setSelectionRange'];
    canBeSelected: SelectionManager<TItem, TId, TFilter>['canBeSelected'];
    useCellSelectionInfo: SelectionManager<TItem, TId, TFilter>['useCellSelectionInfo'];
}

export const DataTableSelectionContext = createContext<SelectionContextState>({
    selectionRange: null, setSelectionRange: null, canBeSelected: null, useCellSelectionInfo: null,
});

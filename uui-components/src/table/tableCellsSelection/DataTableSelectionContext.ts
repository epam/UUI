import { createContext } from "react";
import { SelectionManager } from "./types";


export interface SelectionContextState<TItem = any, TId = any, TFilter = any> {
    selectionRange: SelectionManager<TItem, TId, TFilter>['selectionRange'];
    setSelectionRange: SelectionManager<TItem, TId, TFilter>['setSelectionRange'];
    canBeSelected: SelectionManager<TItem, TId, TFilter>['canBeSelected'];
    getCellSelectionInfo: SelectionManager<TItem, TId, TFilter>['getCellSelectionInfo'];
}

export const DataTableSelectionContext = createContext<SelectionContextState>({
    selectionRange: null, setSelectionRange: null, canBeSelected: null, getCellSelectionInfo: null,
});

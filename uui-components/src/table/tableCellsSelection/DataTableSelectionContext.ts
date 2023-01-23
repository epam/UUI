import { createContext } from "react";
import { SelectionManager } from "./types";


export interface SelectionContextState<TItem = any> {
    selectionRange: SelectionManager<TItem>['selectionRange'];
    setSelectionRange: SelectionManager<TItem>['setSelectionRange'];
    canBeSelected: SelectionManager<TItem>['canBeSelected'];
}

export const DataTableSelectionContext = createContext<SelectionContextState<any>>({
    selectionRange: null, setSelectionRange: null, canBeSelected: null,
});

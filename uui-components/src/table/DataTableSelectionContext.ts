import { createContext } from "react";
import { SelectionManager } from "./useSelectionManager";


export interface SelectionContextState<TItem = any, TId = any, TCellValue = any> {
    selectionRange: SelectionManager<TItem>['selectionRange'];
    setSelectionRange: SelectionManager<TItem>['setSelectionRange'];
    canBeSelected: SelectionManager<TItem>['canBeSelected'];
}

export const DataTableSelectionContext = createContext<SelectionContextState<any, any, any>>({
    selectionRange: null, setSelectionRange: null, canBeSelected: null,
});

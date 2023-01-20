import { createContext } from "react";
import { SelectionManager } from "@epam/uui-core";


export interface SelectionContextState<TItem = any> {
    selectionRange: SelectionManager<TItem>['selectionRange'];
    setSelectionRange: SelectionManager<TItem>['setSelectionRange'];
    canBeSelected: SelectionManager<TItem>['canBeSelected'];
}

export const DataTableSelectionContext = createContext<SelectionContextState<any>>({
    selectionRange: null, setSelectionRange: null, canBeSelected: null,
});

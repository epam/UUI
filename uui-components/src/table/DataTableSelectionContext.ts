import { createContext, Dispatch, SetStateAction } from "react";
import { DataTableCellProps, RenderCellProps } from "@epam/uui-core";
import { SelectionManager, SelectionRange } from "./useSelectionManager";


export interface SelectionContextState<TItem = any, TId = any, TCellValue = any> {
    selectionRange: SelectionManager['selectionRange'];
    setSelectionRange: SelectionManager['setSelectionRange'];
    canBeSelected: SelectionManager['canBeSelected'];
}

export const DataTableSelectionContext = createContext<SelectionContextState<any, any, any>>({ selectionRange: null, setSelectionRange: null, canBeSelected: null });

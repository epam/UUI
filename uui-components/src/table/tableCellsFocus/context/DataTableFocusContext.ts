import { createContext } from 'react';
import { DataTableFocusManager } from '../DataTableFocusManager';

/**
 * State of a DataTableFocusContext.
 */
export interface DataTableFocusContextState<TId> {
    /**
     * Focus manipulation manager in tables.
     */
    dataTableFocusManager: DataTableFocusManager<TId>;
}

export const DataTableFocusContext = createContext<DataTableFocusContextState<any>>({
    dataTableFocusManager: null,
});

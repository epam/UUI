import { createContext } from 'react';
import { DataTableFocusManager } from '../DataTableFocusManager';

export interface DataTableFocusContextState<TId> {
    dataTableFocusManager: DataTableFocusManager<TId>;
}

export const DataTableFocusContext = createContext<DataTableFocusContextState<any>>({
    dataTableFocusManager: null,
});

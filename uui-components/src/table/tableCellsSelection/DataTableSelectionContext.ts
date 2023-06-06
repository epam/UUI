import { createContext } from 'react';
import { SelectionManager } from './types';

export interface SelectionContextState<TItem = any, TId = any, TFilter = any>
    extends Pick<SelectionManager<TItem, TId, TFilter>, 'selectionRange' | 'setSelectionRange' | 'getCellSelectionInfo'> {}

export const DataTableSelectionContext = createContext<SelectionContextState>({
    selectionRange: null,
    setSelectionRange: null,
    getCellSelectionInfo: null,
});

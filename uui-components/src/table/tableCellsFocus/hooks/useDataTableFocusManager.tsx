import { useMemo } from 'react';
import { DataTableFocusManager } from '../DataTableFocusManager';
import { DataTableFocusManagerProps } from '../types';

export function useDataTableFocusManager<TId>(props: DataTableFocusManagerProps = {}, deps: unknown[]): DataTableFocusManager<TId> {
    const focusManager = useMemo(
        () => new DataTableFocusManager<TId>(props),
        deps,
    );

    return focusManager;
}

import { useMemo } from 'react';
import { DataTableFocusManager } from '../DataTableFocusManager';
import { DataTableFocusManagerProps } from '../types';
import { useMovementShortcuts } from './useMovementShortcuts';

export function useDataTableFocusManager<TId>(props: DataTableFocusManagerProps = {}, deps: unknown[]): DataTableFocusManager<TId> {
    const focusManager = useMemo(
        () => new DataTableFocusManager<TId>(props),
        deps,
    );

    useMovementShortcuts({ 
        enableMovementShortcuts: props.enableMovementShortcuts,
        dataTableFocusManager: focusManager,
    });

    return focusManager;
}

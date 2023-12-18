import { useMemo } from 'react';
import { DataTableFocusManager } from '../DataTableFocusManager';
import { useMovementShortcuts } from './useMovementShortcuts';

export interface UseDataTableFocusManagerProps {
    enableMovementShortcuts?: boolean;
}

export function useDataTableFocusManager<TId>(
    { enableMovementShortcuts = true }: UseDataTableFocusManagerProps = {},
    deps: unknown[],
): DataTableFocusManager<TId> {
    const focusManager = useMemo(
        () => new DataTableFocusManager<TId>(),
        [...deps, enableMovementShortcuts],
    );

    useMovementShortcuts({ 
        enableMovementShortcuts,
        dataTableFocusManager: focusManager,
    });

    return focusManager;
}

import { useCallback } from 'react';
import { DataTableFocusManager } from '../DataTableFocusManager';
import { useShortcuts } from './useShortcuts';

export interface UseMovementShortcutsProps<TId> {
    enableMovementShortcuts?: boolean;
    dataTableFocusManager?: DataTableFocusManager<TId>;
}

const isFocusNextRowShortcut = (event: KeyboardEvent) => event.altKey && event.key === 'ArrowDown';
const isFocusPrevRowShortcut = (event: KeyboardEvent) => event.altKey && event.key === 'ArrowUp';

export function useMovementShortcuts<TId>({
    enableMovementShortcuts = true,
    dataTableFocusManager,
}: UseMovementShortcutsProps<TId>) {
    const focusNextRow = useCallback((e: KeyboardEvent) => {
        e.preventDefault();
        dataTableFocusManager?.focusNextRow();
    }, [dataTableFocusManager]);

    const focusPreviousRow = useCallback((e: KeyboardEvent) => {
        e.preventDefault();
        dataTableFocusManager?.focusPrevRow();
    }, [dataTableFocusManager]);
    
    useShortcuts(
        {
            enableShortcuts: enableMovementShortcuts,
            shortcuts: [
                { isMatchingShortcut: isFocusNextRowShortcut, action: focusNextRow },
                { isMatchingShortcut: isFocusPrevRowShortcut, action: focusPreviousRow },
            ],
        },
        [dataTableFocusManager],
    );
}

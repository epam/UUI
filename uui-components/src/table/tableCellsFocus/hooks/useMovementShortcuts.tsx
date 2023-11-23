import { useCallback, useEffect } from 'react';
import { DataTableFocusManager } from '../DataTableFocusManager';
import { useShortcutsManager } from './useShortcutsManager';

export interface UseMovementShortcutsProps<TId> {
    enableMovementShortcuts?: boolean;
    dataTableFocusManager?: DataTableFocusManager<TId>;
}

const focusNextRowShortcut = (event: KeyboardEvent) => event.altKey && event.key === 'ArrowDown';
const focusPrevRowShortcut = (event: KeyboardEvent) => event.altKey && event.key === 'ArrowUp';

export function useMovementShortcuts<TId>(props: UseMovementShortcutsProps<TId>) {
    const shortcutsManager = useShortcutsManager(
        { enableShortcuts: props.enableMovementShortcuts },
        [props.dataTableFocusManager],
    );

    const focusNextRow = useCallback((e: KeyboardEvent) => {
        e.preventDefault();
        props.dataTableFocusManager?.focusNextRow();
    }, [props.dataTableFocusManager]);

    const focusPreviousRow = useCallback((e: KeyboardEvent) => {
        e.preventDefault();
        props.dataTableFocusManager?.focusPrevRow();
    }, [props.dataTableFocusManager]);

    useEffect(() => {
        const removeShortcuts = shortcutsManager?.registerShortcuts([
            [focusNextRowShortcut, focusNextRow],
            [focusPrevRowShortcut, focusPreviousRow],
        ]);
        
        return () => removeShortcuts();
    }, [shortcutsManager, focusNextRow]);
}

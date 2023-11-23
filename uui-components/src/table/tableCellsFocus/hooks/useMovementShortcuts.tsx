import { useCallback, useEffect } from 'react';
import { DataTableFocusManager } from '../DataTableFocusManager';
import { useShortcutsManager } from './useShortcutsManager';

export interface UseMovementShortcutsProps<TId> {
    enableMovementShortcuts?: boolean;
    dataTableFocusManager?: DataTableFocusManager<TId>;
}

const focusNextRowShortcut = (event: KeyboardEvent) => event.altKey && event.key === 'ArrowDown';

export function useMovementShortcuts<TId>(props: UseMovementShortcutsProps<TId>) {
    const shortcutsManager = useShortcutsManager(
        { enableShortcuts: props.enableMovementShortcuts },
        [props.dataTableFocusManager],
    );

    const focusNextRow = useCallback(() => {
        props.dataTableFocusManager?.focusNextRow();
    }, [props.dataTableFocusManager]);

    useEffect(() => {
        const unsubscribe = shortcutsManager?.registerShortcuts([
            [focusNextRowShortcut, focusNextRow],
        ]);
        
        return () => unsubscribe();
    }, [shortcutsManager, focusNextRow]);
}

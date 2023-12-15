import { useEffect, useMemo } from 'react';
import { Shortcut, ShortcutsManager } from '../ShortcutsManager';

export interface UseShortcutsProps {
    enableShortcuts?: boolean;
    shortcuts: Shortcut[]
}

export function useShortcuts(
    { enableShortcuts = true, shortcuts }: UseShortcutsProps,
    deps: unknown[],
) {
    const shortcutsManager = useMemo(
        () => {
            if (!enableShortcuts) return null;
            
            return new ShortcutsManager();
        },
        [...deps, enableShortcuts],
    );

    useEffect(() => {
        const removeShortcuts = shortcutsManager?.registerShortcuts(shortcuts);
        
        return () => removeShortcuts();
    }, [shortcutsManager]);
}

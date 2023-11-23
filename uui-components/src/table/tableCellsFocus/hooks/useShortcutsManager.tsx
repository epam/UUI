import { useMemo } from 'react';
import { ShortcutsManager } from '../ShortcutsManager';

export interface UseShortcutsManagerProps {
    enableShortcuts?: boolean;
}

export function useShortcutsManager(props: UseShortcutsManagerProps = {}, deps: unknown[]): ShortcutsManager {
    const shortcutsManager = useMemo(
        () => {
            if (props.enableShortcuts) {
                return new ShortcutsManager();
            }
            return null;
        },
        [...deps, props.enableShortcuts],
    );

    return shortcutsManager;
}

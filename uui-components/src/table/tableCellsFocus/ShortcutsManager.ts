export type IsMatchingShortcut = (event: KeyboardEvent) => boolean;
export type ShortcutAction = (event: KeyboardEvent) => void;
export interface Shortcut {
    isMatchingShortcut: IsMatchingShortcut;
    action: ShortcutAction;
}

export class ShortcutsManager {
    public registerShortcut(isMatchingShortcut: IsMatchingShortcut, action: ShortcutAction) {
        const keydownHandler = (event: KeyboardEvent) => {
            if (!isMatchingShortcut(event)) return;

            action(event);
        };

        document.addEventListener('keydown', keydownHandler);
        return () => document.removeEventListener('keydown', keydownHandler);
    }

    public registerShortcuts(shortcuts: Shortcut[]) {
        const unsubs = shortcuts.map(({ isMatchingShortcut, action }) =>
            this.registerShortcut(isMatchingShortcut, action));

        return () => unsubs.forEach((removeShortcut) => removeShortcut());
    }
}

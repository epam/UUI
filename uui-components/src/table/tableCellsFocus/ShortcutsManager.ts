type IsExactShortcut = (event: KeyboardEvent) => boolean;
type ShortcutAction = (event: KeyboardEvent) => void;

export class ShortcutsManager {
    public registerShortcut(isExactShortcut: IsExactShortcut, action: ShortcutAction) {
        const keydownHandler = (event: KeyboardEvent) => {
            if (!isExactShortcut(event)) return;

            action(event);
        };

        document.addEventListener('keydown', keydownHandler);
        return () => document.removeEventListener('keydown', keydownHandler);
    }

    public registerShortcuts(shortcuts: Array<[IsExactShortcut, ShortcutAction]>) {
        const unsubs = shortcuts.map((shortcutConfig) => this.registerShortcut(...shortcutConfig));

        return () => unsubs.forEach((unsubscribe) => unsubscribe());
    }
}

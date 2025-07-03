import * as uui from '@epam/uui';
import { createSkinComponent } from '@epam/uui-core';

export interface MainMenuProps extends uui.MainMenuProps {
    /**
     * Defines component color scheme.
     * @default 'dark'
     */
    color?: 'white' | 'dark';
}

function applyMainMenuMods(mods: MainMenuProps) {
    return [
        mods.color && `uui-main_menu-${mods.color || 'dark'}`,
    ];
}

export const MainMenu = createSkinComponent<uui.MainMenuProps, MainMenuProps>(
    uui.MainMenu,
    undefined,
    applyMainMenuMods,
);

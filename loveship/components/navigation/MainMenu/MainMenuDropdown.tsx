import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import type { MainMenuDropdownProps as Props } from '@epam/uui-components';

export interface MainMenuDropdownProps extends Props {
    /**
     * Defines component color scheme.
     * @default 'dark'
     */
    color?: 'white' | 'dark';
}

function applyMainMenuMods(mods: MainMenuDropdownProps) {
    return [
        mods.color && `uui-main_menu-${mods.color || 'dark'}`,
    ];
}

export const MainMenuDropdown = createSkinComponent<Props, MainMenuDropdownProps>(
    uui.MainMenuDropdown,
    undefined,
    applyMainMenuMods,
);

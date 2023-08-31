import css from './MainMenu.module.scss';
import { withMods } from '@epam/uui-core';
import { MainMenu as uuiMainMenu, MainMenuProps } from '@epam/uui-components';
import { Burger } from './Burger';
import { MainMenuDropdown } from './MainMenuDropdown';

export interface MainMenuMods {}

function applyMainMenuMods() {
    return [
        css.root,
        'uui-main_menu',
    ];
}

export const MainMenu = withMods<MainMenuProps, MainMenuMods>(uuiMainMenu, applyMainMenuMods, () => ({
    Burger,
    MainMenuDropdown,
}));

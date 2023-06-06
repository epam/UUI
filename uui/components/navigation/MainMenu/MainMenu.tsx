import css from './MainMenu.module.scss';
import { withMods } from '@epam/uui-core';
import { MainMenu as uuiMainMenu, MainMenuProps } from '@epam/uui-components';
import { Burger, MainMenuDropdown } from '../MainMenu';

export interface MainMenuMods {}

function applyMainMenuMods() {
    return [css.root];
}

export const MainMenu = withMods<MainMenuProps, MainMenuMods>(uuiMainMenu, applyMainMenuMods, () => ({
    Burger,
    MainMenuDropdown,
}));

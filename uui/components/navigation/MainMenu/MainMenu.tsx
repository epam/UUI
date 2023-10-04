import css from './MainMenu.module.scss';
import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { Burger } from './Burger';
import { MainMenuDropdown } from './MainMenuDropdown';

export interface MainMenuMods {}

export type MainMenuProps = uuiComponents.MainMenuProps & MainMenuMods;

function applyMainMenuMods() {
    return [css.root];
}

export const MainMenu = withMods<uuiComponents.MainMenuProps, MainMenuMods>(uuiComponents.MainMenu, applyMainMenuMods, () => ({
    Burger,
    MainMenuDropdown,
}));

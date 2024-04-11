import css from './MainMenu.module.scss';
import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { Burger } from './Burger';
import { MainMenuDropdown } from './MainMenuDropdown';

interface MainMenuMods {}

/** Represents the properties of the MainMenu component. */
export type MainMenuProps = uuiComponents.MainMenuProps & MainMenuMods;

function applyMainMenuMods() {
    return [
        css.root,
        'uui-main_menu',
    ];
}

export const MainMenu = /* @__PURE__ */withMods<uuiComponents.MainMenuProps, MainMenuMods>(uuiComponents.MainMenu, applyMainMenuMods, () => ({
    Burger,
    MainMenuDropdown,
}));

import * as css from './MainMenu.scss';
import { withMods } from '@epam/uui';
import { MainMenu as uuiMainMenu, MainMenuProps } from '@epam/uui-components';
import { Burger, MainMenuDropdown } from '../MainMenu';

export interface MainMenuMods {}

function applyMainMenuMods(mods: MainMenuMods) {
    return [css.root];
}

export const MainMenu = withMods<MainMenuProps, MainMenuMods>(uuiMainMenu, applyMainMenuMods, (props) => ({
    Burger,
    MainMenuDropdown,
}));

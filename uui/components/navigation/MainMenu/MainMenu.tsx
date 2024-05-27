import css from './MainMenu.module.scss';
import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { Burger } from './Burger';
import { MainMenuDropdown } from './MainMenuDropdown';

function applyMainMenuMods() {
    return [
        css.root,
        'uui-main_menu',
    ];
}

export type MainMenuProps = uuiComponents.MainMenuProps;

export const MainMenu = withMods<uuiComponents.MainMenuProps, MainMenuProps>(
    uuiComponents.MainMenu,
    applyMainMenuMods,
    () => ({
        Burger,
        MainMenuDropdown,
    }),
);

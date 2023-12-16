import css from './MainMenuButton.module.scss';
import { Button, ButtonProps } from '@epam/uui-components';
import { IAdaptiveItem, withMods } from '@epam/uui-core';
import { ReactComponent as SvgTriangle } from '../../../icons/chevron-down-24.svg';

interface MainMenuButtonMods {
    /*
    * Defines component type. The primary button leads to the main pages of the site, and the secondary to the others.
    */
    type?: 'primary' | 'secondary';
}

export const MainMenuButton = withMods<ButtonProps, MainMenuButtonMods & IAdaptiveItem>(
    Button,
    (mods) => [css.root, css['type-' + (mods.type || 'primary')]],
    () => ({ dropdownIcon: SvgTriangle, role: 'menuitem' }),
);

import * as css from './MainMenuButton.scss';
import { Button, ButtonProps } from '@epam/uui-components';
import { IAdaptiveItem, withMods } from '@epam/uui';
import * as svgTriangle from '../../icons/triangle.svg';

export interface MainMenuButtonMods {
    type?: 'primary' | 'secondary';
}

export const MainMenuButton = withMods<ButtonProps, MainMenuButtonMods & IAdaptiveItem>(
    Button,
    mods => [
        css.root,
        css['type-' + (mods.type || 'primary')],
        css.fontSansSemibold,
    ],
    () => ({ dropdownIcon: svgTriangle }),
);

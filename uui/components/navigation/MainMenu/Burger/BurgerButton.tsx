import { withMods, IHasIcon, IDropdownToggler } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { ReactComponent as SvgTriangle } from '../../../../icons/triangle.svg';
import css from './BurgerButton.module.scss';

export interface BurgerButtonMods extends IHasIcon, IDropdownToggler {
    type?: 'primary' | 'secondary';
    indentLevel?: number;
}

export const BurgerButton = withMods<ButtonProps, BurgerButtonMods>(
    Button,
    (props) => [
        css.root,
        'uui-mainMenu-burger-button',
        css['button-' + (props.type || 'primary')],
        css['indent-' + (props.indentLevel || 0)],
        props.isDropdown && css.dropdown,
        props.icon && css.hasIcon,
    ],
    () => ({ dropdownIcon: SvgTriangle, dropdownIconPosition: 'left', role: 'menuitem' }),
);

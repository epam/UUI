import { withMods, IHasIcon, IDropdownToggler } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { ReactComponent as SvgTriangle } from '@epam/assets/icons/navigation-arrow_down-outline.svg';
import css from './BurgerButton.module.scss';

interface BurgerButtonMods extends IHasIcon, IDropdownToggler {
    /*
    * Defines component type.
    */
    type?: 'primary' | 'secondary';
    /*
    * Defines components' indent.
    */
    indentLevel?: number;
}

export const BurgerButton = /* @__PURE__ */withMods<ButtonProps, BurgerButtonMods>(
    Button,
    (props) => [
        css.root,
        'uui-main_menu-burger-button',
        css['button-' + (props.type || 'primary')],
        css['indent-' + (props.indentLevel || 0)],
        props.isDropdown && css.dropdown,
        props.icon && css.hasIcon,
    ],
    () => ({ dropdownIcon: SvgTriangle, dropdownIconPosition: 'left', role: 'menuitem' }),
);

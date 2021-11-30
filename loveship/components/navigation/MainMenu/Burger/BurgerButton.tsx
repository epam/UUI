import { withMods, IHasIcon, IDropdownToggler } from '@epam/uui';
import {  Button, ButtonProps } from '@epam/uui-components';
import { ReactComponent as TriangleIcon } from '../../../icons/triangle.svg';
import * as css from './BurgerButton.scss';

export interface BurgerButtonMods extends IHasIcon, IDropdownToggler {
    type?: 'primary' | 'secondary';
    indentLevel?: number;
}

export const BurgerButton = withMods<ButtonProps, BurgerButtonMods>(
    Button,
    props => [
        css.root,
        css['button-' + (props.type || 'primary')],
        css['indent-' + (props.indentLevel || 0)],
        props.isDropdown && css.dropdown,
        props.icon && css.hasIcon,
    ],
    () => ({ dropdownIcon: TriangleIcon, dropdownIconPosition: 'left' }),
);

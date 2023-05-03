import React from 'react';
import css from './DropdownMenu.scss';
import {
    withMods, IHasIcon, IDropdownToggler, VPanelProps,
} from '@epam/uui-core';
import {
    Button, ButtonProps, VPanel, IconContainer, CheckboxProps, Checkbox, TextInput, TextInputProps,
} from '@epam/uui-components';
import { ReactComponent as BtnCross } from '../icons/menu_input_cancel.svg';
import { ReactComponent as BtnTriangle } from '../icons/folding-arrow-18.svg';
import { ReactComponent as TickIcon } from '../icons/tick-12.svg';
import { ReactComponent as LensIcon } from '../icons/search-18.svg';

import cx from 'classnames';

export interface DropdownMenuItemMods extends IHasIcon, IDropdownToggler {
    color?: 'white' | 'night';
    noIcon?: boolean;
    inMainMenu?: boolean;
}

export interface DropdownMenuHeaderProps extends DropdownMenuItemMods {
    title: string;
}

export interface DropdownMenuSearchProps extends TextInputProps, IHasIcon {}

export const DropdownMenuBody = withMods<VPanelProps, DropdownMenuItemMods>(VPanel, (mods: DropdownMenuItemMods) => [
    css.bodyRoot, css['color-' + (mods.color || 'white')], mods.inMainMenu && css.inMainMenu,
]);

export const DropdownMenuButton = withMods<ButtonProps, DropdownMenuItemMods>(
    Button,
    (props) => [
        css.buttonRoot, props.noIcon && !props.icon && !props.isDropdown && css.noIcon, css['color-' + (props.color || 'white')], !props.icon && !props.isDropdown && css.noIcon,
    ],
    () => ({ dropdownIcon: BtnTriangle, clearIcon: BtnCross, dropdownIconPosition: 'left' }),
);

export const DropdownMenuCheckbox = withMods<CheckboxProps, DropdownMenuItemMods>(
    Checkbox,
    (props) => [css.checkboxRoot],
    () => ({ icon: TickIcon }),
);

export function DropdownMenuSearch(props: DropdownMenuSearchProps) {
    return (
        <div className={ cx(css.searchRoot, props.icon && css.noIcon) }>
            {props.icon && <IconContainer cx={ css.icon } icon={ props.icon } />}
            <TextInput iconPosition="right" icon={ LensIcon } placeholder={ props.placeholder } value={ props.value } onValueChange={ props.onValueChange } />
        </div>
    );
}

export function DropdownMenuHeader(props: DropdownMenuHeaderProps) {
    return (
        <header className={ cx(css.headerRoot, !props.icon && css.noIcon, css['color-' + (props.color || 'white')]) }>
            {props.icon && <IconContainer cx={ css.icon } icon={ props.icon } />}
            <span className={ css.title }>{props.title}</span>
        </header>
    );
}

export function DropdownMenuSplitter(props: DropdownMenuItemMods) {
    return (
        <div className={ cx(css.splitterRoot, css['color-' + (props.color || 'white')]) }>
            <hr className={ css.splitter } />
        </div>
    );
}

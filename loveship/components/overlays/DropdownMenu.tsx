import React from 'react';
import * as css from './DropdownMenu.scss';
import {  withMods, IHasIcon,  IDropdownToggler, VPanelProps } from '@epam/uui';
import { Button, ButtonProps, VPanel, IconContainer, CheckboxProps,
    Checkbox, TextInput, TextInputProps } from '@epam/uui-components';
import * as btnCross from '../icons/menu_input_cancel.svg';
import * as btnTriangle from '../icons/folding-arrow-18.svg';
import * as tickIcon from '../icons/tick-12.svg';
import * as lensIcon from '../icons/search-18.svg';

import cx from "classnames";

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
    css.bodyRoot,
    css['color-' + (mods.color || 'white')],
    mods.inMainMenu && css.inMainMenu,
]);

export const DropdownMenuButton = withMods<ButtonProps, DropdownMenuItemMods>(
    Button,
    (props) => [
        css.buttonRoot,
        props.noIcon && !props.icon && !props.isDropdown && css.noIcon,
        css['color-' + (props.color || 'white')],
        !props.icon && !props.isDropdown && css.noIcon,
    ],
    () => ({ dropdownIcon: btnTriangle, clearIcon: btnCross, dropdownIconPosition: 'left' }),
);

export const DropdownMenuCheckbox = withMods<CheckboxProps, DropdownMenuItemMods>(Checkbox, (props) =>
        [css.checkboxRoot],
        () => ({ icon: tickIcon }),
);

export const DropdownMenuSearch = (props: DropdownMenuSearchProps) => {
    return (
        <div className={ cx(
                css.searchRoot,
                props.icon && css.noIcon,
            ) }>
            { props.icon && <IconContainer cx={ css.icon } icon={ props.icon }/> }
            <TextInput iconPosition='right' icon={ lensIcon } placeholder={ props.placeholder } value={ props.value } onValueChange={ props.onValueChange }/>
        </div>
    );
};

export const DropdownMenuHeader = (props: DropdownMenuHeaderProps) => {
    return (
        <header className={ cx(css.headerRoot, !props.icon && css.noIcon, css['color-' + (props.color || 'white')]) }>
            { props.icon && <IconContainer cx={ css.icon } icon={ props.icon }/> }
            <span className={ css.title }>{ props.title }</span>
        </header>
    );
};

export const DropdownMenuSplitter = (props: DropdownMenuItemMods) => {
    return (
        <div className={ cx(css.splitterRoot, css['color-' + (props.color || 'white')]) }>
            <hr className={ css.splitter }/>
        </div>
    );
};

import { withMods } from '@epam/uui-core';
import { DropdownContainer as uuiDropdownListContainer, DropdownContainerProps as uuiDropdownContainerProps } from '@epam/uui-components';
import css from './DropdownContainer.scss';

export interface DropdownContainerMods {
    vPadding?: '6' | '12' | '18' | '24' | '30' | '48';
    padding?: '6' | '12' | '18' | '24' | '30';
}

export interface DropdownContainerProps extends uuiDropdownContainerProps, DropdownContainerMods {}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [css.root, mods.vPadding && `vPadding-${mods.vPadding}`, mods.padding && `padding-${mods.padding}`];
}

export const DropdownContainer = withMods<uuiDropdownContainerProps, DropdownContainerMods>(uuiDropdownListContainer, applyDropdownContainerMods);

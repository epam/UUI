import css from './DropdownContainer.scss';
import { withMods } from '@epam/uui-core';
import { DropdownContainer as uuiDropdownListContainer, DropdownContainerProps } from '@epam/uui-components';

export interface DropdownContainerMods {
    vPadding?: '6' | '12' | '18' | '24' | '30' | '48';
    padding?: '6' | '12' | '18' | '24' | '30';
    color?: 'white' | 'gray70';
}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [
        css.root,
        css['background-' + (mods.color || 'white')],
        mods.vPadding && css['vPadding-' + mods.vPadding],
        mods.padding && css['padding-' + mods.padding],
    ];
}
export const DropdownContainer = withMods<DropdownContainerProps, DropdownContainerMods>(uuiDropdownListContainer, applyDropdownContainerMods);

import { withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';

export interface DropdownContainerMods {
    color?: 'white' | 'night700';
}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [`uui-color-${mods.color || 'white'}`];
}

export type DropdownContainerProps = uui.DropdownContainerProps & DropdownContainerMods;

export const DropdownContainer = withMods<uui.DropdownContainerProps, DropdownContainerMods>(uui.DropdownContainer, applyDropdownContainerMods);

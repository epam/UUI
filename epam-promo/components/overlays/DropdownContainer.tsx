import { withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';

export interface DropdownContainerMods {
    color?: 'white' | 'gray70';
}

export type DropdownContainerProps = uui.DropdownContainerProps & DropdownContainerMods;

export function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [`uui-color-${mods.color || 'white'}`];
}
export const DropdownContainer = withMods<uui.DropdownContainerProps, DropdownContainerMods>(uui.DropdownContainer, applyDropdownContainerMods);

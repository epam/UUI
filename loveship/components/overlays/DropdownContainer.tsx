import { withMods } from '@epam/uui-core';
import { DropdownContainer as uuiDropdownListContainer, DropdownContainerProps } from '@epam/uui';

export interface DropdownContainerMods {
    color?: 'white' | 'night700';
}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [
        `dropdown-container-${mods.color || 'white'}`,
    ];
}

export const DropdownContainer = withMods<DropdownContainerProps, DropdownContainerMods>(uuiDropdownListContainer, applyDropdownContainerMods);

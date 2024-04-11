import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface DropdownContainerMods {
    /**
     * Defines component color.
     */
    color?: 'white' | 'night700';
}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [`uui-color-${mods.color || 'white'}`];
}

/** Represents the properties of the DropdownContainer component. */
export interface DropdownContainerProps extends uui.DropdownContainerProps, DropdownContainerMods {}

export const DropdownContainer = /* @__PURE__ */createSkinComponent<uui.DropdownContainerProps, DropdownContainerProps>(
    uui.DropdownContainer,
    () => null,
    applyDropdownContainerMods,
);

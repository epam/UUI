import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface DropdownContainerMods {
    /**
     * Defines component color.
     * @default 'white'
     */
    color?: 'white' | 'gray70';
}

/** Represents the properties of a DropdownContainer component. */
export interface DropdownContainerProps extends uui.DropdownContainerProps, DropdownContainerMods {}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [`uui-color-${mods.color || 'white'}`];
}

export const DropdownContainer = /* @__PURE__ */createSkinComponent<uui.DropdownContainerProps, DropdownContainerProps>(
    uui.DropdownContainer,
    () => null,
    applyDropdownContainerMods,
);

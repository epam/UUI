import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type DropdownContainerMods = {
    /**
     * Defines component color.
     * @default 'white'
     * */
    color?: 'white' | 'gray70';
};

/** Represents the properties of a DropdownContainer component. */
export type DropdownContainerProps = uui.DropdownContainerProps & DropdownContainerMods;

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [`uui-color-${mods.color || 'white'}`];
}

export const DropdownContainer = createSkinComponent<uui.DropdownContainerProps, DropdownContainerProps>(
    uui.DropdownContainer,
    () => null,
    applyDropdownContainerMods,
);

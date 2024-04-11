import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import css from './DropdownContainer.module.scss';

interface DropdownContainerMods {
    /**
     * Defines vertical padding.
     */
    vPadding?: '6' | '12' | '18' | '24' | '30' | '48';
    /**
     * Defines horizontal padding.
     */
    padding?: '6' | '12' | '18' | '24' | '30';
}

/** Represents the properties of a DropdownContainer component. */
export interface DropdownContainerProps extends uuiComponents.DropdownContainerProps, DropdownContainerMods {}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [
        css.root,
        mods.vPadding && `vPadding-${mods.vPadding}`,
        mods.padding && `padding-${mods.padding}`,
    ];
}

export const DropdownContainer = /* @__PURE__ */withMods<
uuiComponents.DropdownContainerProps, DropdownContainerMods
>(uuiComponents.DropdownContainer, applyDropdownContainerMods);

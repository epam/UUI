import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import css from './DropdownContainer.module.scss';

type DropdownContainerMods = {
    /**
     * Defines vertical padding.
     */
    vPadding?: '6' | '12' | '18' | '24' | '30' | '48';
    /**
     * Defines horizontal padding.
     */
    padding?: '6' | '12' | '18' | '24' | '30';
};

/** Represents the properties of a DropdownContainer component. */
export type DropdownContainerProps = uuiComponents.DropdownContainerProps & DropdownContainerMods;

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [
        css.root,
        mods.vPadding && `vPadding-${mods.vPadding}`,
        mods.padding && `padding-${mods.padding}`,
    ];
}

export const DropdownContainer = withMods<uuiComponents.DropdownContainerProps, DropdownContainerMods>(uuiComponents.DropdownContainer, applyDropdownContainerMods);

import { withMods } from '@epam/uui-core';
import { DropdownContainer as uuiDropdownListContainer, DropdownContainerProps } from '@epam/uui-components';
import '../../assets/styles/variables/overlays/dropdownContainer.scss';
import css from './DropdownContainer.scss';

export interface DropdownContainerMods {}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [
        'dropdown-container-vars',
        css.root,
    ];
}

export const DropdownContainer = withMods<DropdownContainerProps, DropdownContainerMods>(uuiDropdownListContainer, applyDropdownContainerMods);

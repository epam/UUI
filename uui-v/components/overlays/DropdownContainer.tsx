import { withMods } from '@epam/uui';
import { DropdownContainer as uuiDropdownListContainer, DropdownContainerProps } from '@epam/uui-components';
import * as css from './DropdownContainer.scss';
import '../../assets/styles/variables/overlays/dropdownContainer.scss';

export interface DropdownContainerMods {}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [
        'dropdown-container-vars',
        css.root,
    ];
}

export const DropdownContainer = withMods<DropdownContainerProps, DropdownContainerMods>(uuiDropdownListContainer, applyDropdownContainerMods);
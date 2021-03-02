import * as css from './DropdownContainer.scss';
import { withMods } from '@epam/uui';
import { DropdownContainer as uuiDropdownListContainer, DropdownContainerProps } from '@epam/uui-components';

export interface DropdownContainerMods {
    color?: 'white' | 'night700';
}

function applyDropdownContainerMods(mods: DropdownContainerMods) {
    return [
        css.root,
        css['background-' + (mods.color || 'white')],
    ];
}

export const DropdownContainer = withMods<DropdownContainerProps, DropdownContainerMods>(uuiDropdownListContainer, applyDropdownContainerMods);
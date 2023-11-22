import * as types from '@epam/uui';
import { IEditableDebouncerOptions, withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';
import * as uuiComponents from '@epam/uui-components';
import { systemIcons } from '../icons/icons';
import css from './TextInput.module.scss';

const defaultSize = '36';

export interface TextInputMods extends types.IHasEditMode {
    /**
     * @default '36'
     */
    size?: types.ControlSize | '60';
}

export function applyTextInputMods(mods: TextInputMods) {
    return [css['size-' + (mods.size || defaultSize)]];
}

export type TextInputProps = uuiComponents.TextInputProps & TextInputMods;
export const TextInput = withMods<uuiComponents.TextInputProps, TextInputMods>(uui.TextInput, applyTextInputMods, (props) => ({
    acceptIcon: systemIcons[props.size || defaultSize].accept,
    cancelIcon: systemIcons[props.size || defaultSize].clear,
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
}));

export type SearchInputProps = uuiComponents.TextInputProps & TextInputMods & IEditableDebouncerOptions;
export const SearchInput = withMods<uuiComponents.TextInputProps, TextInputMods & IEditableDebouncerOptions>(uui.SearchInput, applyTextInputMods, (props) => ({
    acceptIcon: systemIcons[props.size || defaultSize].accept,
    cancelIcon: systemIcons[props.size || defaultSize].clear,
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    icon: props.icon ?? systemIcons[props.size || defaultSize].search,
}));

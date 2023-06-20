import * as types from '@epam/uui';
import { IEditableDebouncerOptions, withMods } from '@epam/uui-core';
import { TextInput as uuiTextInput, SearchInput as UuiSearchInput } from '@epam/uui';
import { TextInputProps } from '@epam/uui-components';
import { systemIcons } from '../icons/icons';
import css from './TextInput.module.scss';

const defaultSize = '36';

export interface TextInputMods extends types.IHasEditMode {
    size?: types.ControlSize | '60';
}

export function applyTextInputMods(mods: TextInputMods) {
    return [css['size-' + (mods.size || defaultSize)]];
}

export const TextInput = withMods<TextInputProps, TextInputMods>(uuiTextInput, applyTextInputMods, (props) => ({
    acceptIcon: systemIcons[props.size || defaultSize].accept,
    cancelIcon: systemIcons[props.size || defaultSize].clear,
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
}));

export const SearchInput = withMods<TextInputProps, TextInputMods & IEditableDebouncerOptions>(UuiSearchInput, applyTextInputMods, (props) => ({
    acceptIcon: systemIcons[props.size || defaultSize].accept,
    cancelIcon: systemIcons[props.size || defaultSize].clear,
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    icon: props.icon ?? systemIcons[props.size || defaultSize].search,
}));

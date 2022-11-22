import * as React from 'react';
import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { TextInput as uuiTextInput, SearchInput as UuiSearchInput } from '@epam/uui';
import { TextInputProps } from '@epam/uui-components';
import { TextSettings } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';
import * as css from './TextInput.scss';
import * as colorStyle from '../../assets/styles/scss/loveship-color-vars.scss';

const defaultSize = '36';

export interface TextInputMods extends types.EditMode, TextSettings {
    size?: types.ControlSize | '60';
}

export function applyTextInputMods(mods: TextInputMods) {
    return [
        colorStyle.colorSky,
        css['size-' + (mods.size || defaultSize)],
    ];
}

export const TextInput = withMods<TextInputProps, TextInputMods>(
    uuiTextInput, applyTextInputMods,
    (props) => ({
        acceptIcon: systemIcons[props.size || defaultSize].accept,
        cancelIcon: systemIcons[props.size || defaultSize].clear,
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    }),
);

export const SearchInput = UuiSearchInput;

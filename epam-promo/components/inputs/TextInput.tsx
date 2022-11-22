import * as React from 'react';
import { withMods } from '@epam/uui-core';
import { TextInput as UuiTextInput, SearchInput as UuiSearchInput } from '@epam/uui';
import { TextInputProps } from '@epam/uui-components';
import * as types from '../types';
import { IHasEditMode } from '../types';
import { systemIcons } from '../../icons/icons';
import * as css from './TextInput.scss';

const defaultSize = '36';

export interface TextInputMods extends IHasEditMode {
    size?: types.ControlSize;
}

export function applyTextInputMods(mods: TextInputMods) {
    return [
        css['size-' + (mods.size || defaultSize)],
    ];
}

export const TextInput = withMods<TextInputProps, TextInputMods>(
    UuiTextInput, applyTextInputMods,
    (props) => ({
        acceptIcon: systemIcons[props.size || defaultSize].accept,
        cancelIcon: systemIcons[props.size || defaultSize].clear,
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    }),
);

export const SearchInput = UuiSearchInput;

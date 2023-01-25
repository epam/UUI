import * as React from 'react';
import { IEditableDebouncerOptions, withMods } from '@epam/uui-core';
import { TextInput as UuiTextInput, SearchInput as UuiSearchInput } from '@epam/uui';
import { TextInputProps } from '@epam/uui';

export const applyTextInputMods = () => ['uui-theme-promo'];

export const TextInput = withMods<TextInputProps>(UuiTextInput, applyTextInputMods, () => ({}));

export const SearchInput = withMods<TextInputProps & IEditableDebouncerOptions>(UuiSearchInput, applyTextInputMods, () => ({}));


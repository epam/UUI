import * as React from 'react';
import { IEditableDebouncerOptions, withMods } from '@epam/uui-core';
import { TextInput as UuiTextInput, SearchInput as UuiSearchInput } from '@epam/uui';
import { TextInputProps } from '@epam/uui';

export const TextInput = withMods<TextInputProps>(UuiTextInput, () => {}, () => ({}));

export const SearchInput = withMods<TextInputProps & IEditableDebouncerOptions>(UuiSearchInput, () => {}, () => ({}));


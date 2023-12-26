import React from 'react';
import { withMods, IEditableDebouncer, IEditableDebouncerOptions } from '@epam/uui-core';
import { TextInput as uuiTextInput, TextInputProps as CoreTextInputProps } from '@epam/uui-components';
import { IHasEditMode, EditMode, ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import css from './TextInput.module.scss';

const DEFAULT_SIZE = '36';
const DEFAULT_MODE = EditMode.FORM;

type TextInputMods = IHasEditMode & {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: ControlSize | '60';
};

function applyTextInputMods(mods: TextInputMods) {
    return [
        css.root,
        css['size-' + (mods.size || DEFAULT_SIZE)],
        css['mode-' + (mods.mode || DEFAULT_MODE)],
    ];
}

/** Represents the properties for a TextInput component. */
export interface TextInputProps extends CoreTextInputProps, TextInputMods {}

/** Represents the properties for a SearchInput component. */
export interface SearchInputProps extends TextInputProps, IEditableDebouncerOptions {}

export const TextInput = withMods<CoreTextInputProps, TextInputMods>(uuiTextInput, applyTextInputMods, (props) => ({
    acceptIcon: systemIcons[props.size || DEFAULT_SIZE].accept,
    cancelIcon: systemIcons[props.size || DEFAULT_SIZE].clear,
    dropdownIcon: systemIcons[props.size || DEFAULT_SIZE].foldingArrow,
}));

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
    // analytics events are sending in IEditableDebouncer, so we need to avoid sending events in TextInput
    const { ...textInputProps } = props;
    delete textInputProps.getValueChangeAnalyticsEvent;

    return (
        <IEditableDebouncer
            { ...props }
            render={ (iEditable) => (
                <TextInput
                    icon={ systemIcons[props.size || DEFAULT_SIZE].search }
                    onCancel={ !!props.value && (() => iEditable.onValueChange('')) }
                    type="search"
                    inputMode="search"
                    ref={ ref }
                    { ...textInputProps }
                    { ...iEditable }
                />
            ) }
        />
    );
});

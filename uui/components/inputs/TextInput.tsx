import React from 'react';
import { withMods, IEditableDebouncer, IEditableDebouncerOptions } from '@epam/uui-core';
import { TextInput as uuiTextInput, TextInputProps as CoreTextInputProps } from '@epam/uui-components';
import { IHasEditMode, EditMode, ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import css from './TextInput.module.scss';

const defaultSize = '36';
const defaultMode = EditMode.FORM;

export interface TextInputMods extends IHasEditMode {
    /**
     * @default '36'
     */
    size?: ControlSize;
}

export function applyTextInputMods(mods: TextInputMods) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
        css['mode-' + (mods.mode || defaultMode)],
    ];
}

export interface TextInputProps extends CoreTextInputProps, TextInputMods {}
export interface SearchInputProps extends TextInputProps, IEditableDebouncerOptions {}

export const TextInput = withMods<CoreTextInputProps, TextInputMods>(uuiTextInput, applyTextInputMods, (props) => ({
    acceptIcon: systemIcons[props.size || defaultSize].accept,
    cancelIcon: systemIcons[props.size || defaultSize].clear,
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
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
                    icon={ systemIcons[props.size || defaultSize].search }
                    onCancel={ !!props.value
                        // In a lot of places, it is required to check if a clicked element is a part of some other element.
                        // Usually, those are global click event handlers. To allow that logic to work correctly, it is necessary
                        // to execute the `disappearing` of the cross (setState execution) after the event will pass through all the handlers.
                        // Related issue: https://github.com/epam/UUI/issues/1045.
                        ? (() => setTimeout(() => iEditable.onValueChange(''), 0))
                        : undefined }
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

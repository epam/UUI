import * as React from 'react';
import { withMods, IEditableDebouncer, IEditableDebouncerOptions } from '@epam/uui-core';
import { TextInput as uuiTextInput, TextInputProps } from '@epam/uui-components';
import * as types from '../types';
import { IHasEditMode, EditMode } from '../types';
import { systemIcons } from '../../icons/icons';
import css from './TextInput.scss';

const defaultSize = '36';
const defaultMode = EditMode.FORM;

export interface TextInputMods extends IHasEditMode {
    size?: types.ControlSize;
}

export function applyTextInputMods(mods: TextInputMods) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
        css['mode-' + (mods.mode || defaultMode)],
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

export const SearchInput = React.forwardRef<HTMLInputElement, TextInputProps & TextInputMods & IEditableDebouncerOptions>(
    (props, ref) => {
        // analytics events are sending in IEditableDebouncer, so we need to avoid sending events in TextInput
        const { getValueChangeAnalyticsEvent, ...textInputProps } = props;

        return (
            <IEditableDebouncer
                { ...props }
                render={ iEditable => (
                    <TextInput
                        icon={ systemIcons[props.size || defaultSize].search }
                        onCancel={ !!props.value ? (() => iEditable.onValueChange('')) : undefined }
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

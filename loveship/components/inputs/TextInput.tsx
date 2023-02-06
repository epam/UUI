import * as React from 'react';
import * as types from '../types';
import css from './TextInput.scss';
import colorStyle from '../../assets/styles/scss/loveship-color-vars.scss';
import { withMods, IEditableDebouncer, IEditableDebouncerOptions } from '@epam/uui-core';
import { TextInput as uuiTextInput, TextInputProps } from '@epam/uui-components';
import { getTextClasses, TextSettings } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';

const defaultSize = '36';

export interface TextInputMods extends types.EditMode, TextSettings {
    size?: types.ControlSize | '60';
}

export function applyTextInputMods(mods: TextInputMods) {
    return [
        colorStyle.colorSky,
        css.root,
        css['size-' + (mods.size || defaultSize)],
        css['mode-' + (mods.mode || 'form')],
    ];
}

export const TextInput = withMods<TextInputProps, TextInputMods>(
    uuiTextInput, applyTextInputMods,
    (props) => ({
        acceptIcon: systemIcons[props.size || defaultSize].accept,
        cancelIcon: systemIcons[props.size || defaultSize].clear,
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
        inputCx: getTextClasses({
            size: props.size || defaultSize,
            lineHeight: props.lineHeight,
            fontSize: props.fontSize,
        }, true),
    }),
);

export const SearchInput = React.forwardRef<HTMLInputElement, TextInputProps & TextInputMods & IEditableDebouncerOptions>(
    (props, ref) => (
        <IEditableDebouncer
            { ...props }
            render={ iEditable => (
                <TextInput
                    icon={ systemIcons[props.size || defaultSize].search }
                    onCancel={ !!props.value ? (() => iEditable.onValueChange('')) : undefined }
                    type="search"
                    inputMode="search"
                    ref={ ref }
                    { ...props }
                    { ...iEditable }
                />
            ) }
        />
    )
);

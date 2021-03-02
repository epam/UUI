import * as React from 'react';
import * as types from '../types';
import * as css from './TextInput.scss';
import * as colorStyle from '../../assets/styles/scss/loveship-color-vars.scss';
import { withMods, IEditableDebouncer, IEditableDebouncerOptions } from '@epam/uui';
import { TextInput as uuiTextInput, TextInputProps } from '@epam/uui-components';
import { getTextClasses, TextSettings } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';

const defaultSize = '36';

export interface TextInputMods extends types.EditMode, TextSettings {
    size?: types.ControlSize | '60' | '42';
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

export class SearchInput extends React.Component<TextInputProps & TextInputMods & IEditableDebouncerOptions, {}> {
    render() {
        return <IEditableDebouncer
            { ...this.props }
            render={ (iEditable =>
                <TextInput
                    icon={ systemIcons[this.props.size || defaultSize].search }
                    onCancel={ !!this.props.value ? (() => iEditable.onValueChange('')) : undefined }
                    { ...this.props }
                    { ...iEditable }
                />
            ) }
        />;
    }
}

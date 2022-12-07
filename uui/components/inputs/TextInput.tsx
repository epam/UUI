import React from 'react';
import { withMods, IEditableDebouncer, IEditableDebouncerOptions } from '@epam/uui-core';
import { TextInput as uuiTextInput, TextInputProps } from '@epam/uui-components';
import { IHasEditMode, EditMode, ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import css from './TextInput.scss';
import '../../assets/styles/variables/inputs/textInput.scss';

const defaultSize = '36';
const defaultMode = EditMode.FORM;

export interface TextInputMods extends IHasEditMode {
    size?: ControlSize;
}

export function applyTextInputMods(mods: TextInputMods) {
    return [
        'text-input-vars',
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

export class SearchInput extends React.Component<TextInputProps & TextInputMods & IEditableDebouncerOptions, {}> {
    render() {
        // analytics events are sending in IEditableDebouncer, so we need to avoid sending events in TextInput
        const textInputProps = {...this.props};
        delete textInputProps.getValueChangeAnalyticsEvent;

        return <IEditableDebouncer
            { ...this.props }
            render={ (iEditable =>
                    <TextInput
                        icon={ systemIcons[this.props.size || defaultSize].search }
                        onCancel={ !!this.props.value ? (() => iEditable.onValueChange('')) : undefined }
                        type="search"
                        inputMode="search"
                        { ...textInputProps }
                        { ...iEditable }
                    />
            ) }
        />;
    }
}

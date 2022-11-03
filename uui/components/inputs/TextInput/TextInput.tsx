import React from 'react';
import { withMods, IEditableDebouncer, IEditableDebouncerOptions } from '@epam/uui-core';
import { TextInput as uuiTextInput, TextInputProps } from '@epam/uui-components';
import { IHasEditMode, EditMode } from '../../types';
import { getIcon } from '../../../icons';
import * as css from './TextInput.scss';
import './TextInput.colorvars.scss';

const defaultMode = EditMode.FORM;

export interface TextInputMods extends IHasEditMode {
    size?: string;
}

export function applyTextInputMods(mods: TextInputMods) {
    return [
        'text-input-colorvars',
        mods.size && `text-input-size-${mods.size}`,
        css.root,
        css['mode-' + (mods.mode || defaultMode)],
    ];
}

export const TextInput = withMods<TextInputProps, TextInputMods>(
    uuiTextInput, applyTextInputMods,
    (props) => ({
        acceptIcon: getIcon('accept'),
        cancelIcon: getIcon('clear'),
        dropdownIcon: getIcon('foldingArrow'),
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
                        icon={ getIcon('search') }
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
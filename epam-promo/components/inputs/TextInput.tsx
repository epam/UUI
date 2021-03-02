import * as React from 'react';
import * as types from '../types';
import * as css from './TextInput.scss';
import { withMods, IEditableDebouncer, IEditableDebouncerOptions } from '@epam/uui';
import { TextInput as uuiTextInput, TextInputProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';

const defaultSize = '36';

export interface TextInputMods {
    size?: types.ControlSize;
}

export function applyTextInputMods(mods: TextInputMods) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
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
                        { ...textInputProps }
                        { ...iEditable }
                    />
            ) }
        />;
    }
}
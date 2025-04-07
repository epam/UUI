import * as React from 'react';
import { TextInputProps, TextInput } from '@epam/uui-components';
import { ReactComponent as LensIcon } from '@epam/assets/icons/action-search-outline.svg';
import { ReactComponent as CancelIcon } from '@epam/assets/icons/navigation-close-outline.svg';
import { cx, IAdaptiveItem, IEditableDebouncer } from '@epam/uui-core';
import css from './MainMenuSearch.module.scss';

/** Represents the properties of the MainMenuSearch component. */
export interface MainMenuSearchProps extends TextInputProps, IAdaptiveItem, React.RefAttributes<HTMLInputElement> {}

export function MainMenuSearch(props: MainMenuSearchProps) {
    return (
        <IEditableDebouncer
            { ...props }
            render={ (iEditable) => (
                <TextInput
                    iconPosition="left"
                    icon={ LensIcon }
                    cancelIcon={ props.value?.length > 0 && CancelIcon }
                    { ...props }
                    { ...iEditable }
                    ref={ props.ref }
                    cx={ cx(css.searchInput, props.cx) }
                    { ...props.rawProps }
                />
            ) }
        />
    );
}

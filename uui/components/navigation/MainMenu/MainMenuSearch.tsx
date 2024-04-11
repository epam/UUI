import * as React from 'react';
import { TextInputProps, TextInput } from '@epam/uui-components';
import { ReactComponent as LensIcon } from '@epam/assets/icons/action-search-outline.svg';
import { ReactComponent as CancelIcon } from '@epam/assets/icons/navigation-close-outline.svg';
import { cx, IAdaptiveItem, IEditableDebouncer } from '@epam/uui-core';
import css from './MainMenuSearch.module.scss';

/** Represents the properties of the MainMenuSearch component. */
export interface MainMenuSearchProps extends TextInputProps, IAdaptiveItem {}

export const MainMenuSearch = /* @__PURE__ */React.forwardRef<HTMLInputElement, MainMenuSearchProps>((props, ref) => (
    <IEditableDebouncer
        { ...props }
        render={ (iEditable) => (
            <TextInput
                iconPosition="left"
                icon={ LensIcon }
                cancelIcon={ props.value?.length > 0 && CancelIcon }
                { ...props }
                { ...iEditable }
                ref={ ref }
                cx={ cx(css.searchInput, props.cx) }
                { ...props.rawProps }
            />
        ) }
    />
));

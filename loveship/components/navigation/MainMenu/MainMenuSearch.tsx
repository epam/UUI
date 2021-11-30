import React from 'react';
import { TextInputProps, TextInput } from '@epam/uui-components';
import { ReactComponent as LensIcon } from '../../icons/search-18.svg';
import { ReactComponent as CancelIcon } from '../../icons/menu_input_cancel.svg';
import { cx, IAdaptiveItem } from '@epam/uui';
import * as css from './MainMenuSearch.scss';

export interface MainMenuSearchProps extends TextInputProps, IAdaptiveItem {
}

export const MainMenuSearch = (props: MainMenuSearchProps) => (
    <TextInput
        iconPosition='left'
        icon={ LensIcon }
        cancelIcon={ props.value.length > 0 && CancelIcon }
        { ...props }
        cx={ cx(css.searchInput, props.cx) }
    />
);

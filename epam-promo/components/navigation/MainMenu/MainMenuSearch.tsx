import * as React from 'react';
import { TextInputProps, TextInput } from '@epam/uui-components';
import * as lensIcon from '../../../icons/search-18.svg';
import * as cancelIcon from '../../../icons/menu_input_cancel.svg';
import { cx, IAdaptiveItem } from '@epam/uui';
import * as css from './MainMenuSearch.scss';

export interface MainMenuSearchProps extends TextInputProps, IAdaptiveItem {
}

export const MainMenuSearch = (props: MainMenuSearchProps) => (
    <TextInput
        iconPosition='left'
        icon={ lensIcon }
        cancelIcon={ props.value?.length > 0 && cancelIcon }
        { ...props }
        cx={ cx(css.searchInput, props.cx) }
    />
);

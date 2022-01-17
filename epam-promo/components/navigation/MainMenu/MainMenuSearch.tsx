import * as React from 'react';
import { TextInputProps, TextInput } from '@epam/uui-components';
import { ReactComponent as LensIcon } from '../../../icons/search-18.svg';
import { ReactComponent as CancelIcon } from '../../../icons/menu_input_cancel.svg';
import { cx, IAdaptiveItem, IEditableDebouncer } from '@epam/uui';
import * as css from './MainMenuSearch.scss';

export interface MainMenuSearchProps extends TextInputProps, IAdaptiveItem {
}

export const MainMenuSearch = (props: MainMenuSearchProps) => (
    <IEditableDebouncer
        { ...props }
        render={ iEditable => <TextInput
            iconPosition='left'
            icon={ LensIcon }
            cancelIcon={ props.value?.length > 0 && CancelIcon }
            { ...props }
            { ...iEditable }
            cx={ cx(css.searchInput, props.cx) }
        /> }
    />

);

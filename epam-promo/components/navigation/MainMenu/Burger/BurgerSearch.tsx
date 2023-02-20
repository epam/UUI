import * as React from 'react';
import { TextInput, TextInputProps } from '@epam/uui-components';
import { ReactComponent as LensIcon } from '../../../../icons/search-18.svg';
import { ReactComponent as CancelIcon } from '../../../../icons/menu_input_cancel.svg';
import css from './BurgerSearch.scss';

export interface BurgerSearchProps extends TextInputProps {}

export const BurgerSearch = (props: BurgerSearchProps) => (
    <TextInput
        cx={css.searchInput}
        iconPosition="left"
        icon={LensIcon}
        placeholder={props.placeholder}
        value={props.value}
        onValueChange={props.onValueChange}
        onCancel={props.onCancel}
        cancelIcon={props.value && CancelIcon}
        autoFocus
    />
);

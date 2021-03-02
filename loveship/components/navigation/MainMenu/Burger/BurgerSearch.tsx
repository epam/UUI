import React from 'react';
import { TextInput, TextInputProps } from '@epam/uui-components';
import * as lensIcon from '../../../icons/search-18.svg';
import * as cancelIcon from '../../../icons/menu_input_cancel.svg';
import * as css from './BurgerSearch.scss';

export interface BurgerSearchProps extends TextInputProps {}

export const BurgerSearch = (props: BurgerSearchProps) => (
        <TextInput
            cx={ css.searchInput }
            iconPosition='left'
            icon={ lensIcon }
            placeholder={ props.placeholder }
            value={ props.value }
            onValueChange={ props.onValueChange }
            onCancel={ props.onCancel }
            cancelIcon={ props.value && cancelIcon }
            autoFocus
        />
);

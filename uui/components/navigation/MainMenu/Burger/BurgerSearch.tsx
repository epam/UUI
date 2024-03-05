import * as React from 'react';
import { TextInput, TextInputProps } from '@epam/uui-components';
import { ReactComponent as LensIcon } from '@epam/assets/icons/action-search-outline.svg';
import { ReactComponent as CancelIcon } from '@epam/assets/icons/navigation-close-outline.svg';
import css from './BurgerSearch.module.scss';
import cx from 'classnames';

interface BurgerSearchProps extends TextInputProps {}

export function BurgerSearch(props: BurgerSearchProps) {
    return (
        <TextInput
            cx={ cx(css.searchInput, 'uui-main_menu-burger-search') }
            iconPosition="left"
            icon={ LensIcon }
            placeholder={ props.placeholder }
            value={ props.value }
            onValueChange={ props.onValueChange }
            onCancel={ props.onCancel }
            cancelIcon={ props.value && CancelIcon }
        />
    );
}

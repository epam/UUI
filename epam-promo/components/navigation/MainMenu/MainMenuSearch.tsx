import * as React from 'react';
import { TextInputProps, TextInput } from '@epam/uui-components';
import { ReactComponent as LensIcon } from '../../../icons/search-18.svg';
import { ReactComponent as CancelIcon } from '../../../icons/menu_input_cancel.svg';
import { cx, IAdaptiveItem, IEditableDebouncer } from '@epam/uui-core';
import css from './MainMenuSearch.scss';

export interface MainMenuSearchProps extends TextInputProps, IAdaptiveItem {}

export const MainMenuSearch = React.forwardRef<HTMLInputElement, MainMenuSearchProps>((props, ref) => (
    <IEditableDebouncer
        {...props}
        render={iEditable => (
            <TextInput
                iconPosition="left"
                icon={LensIcon}
                cancelIcon={props.value?.length > 0 && CancelIcon}
                {...props}
                {...iEditable}
                ref={ref}
                cx={cx(css.searchInput, props.cx)}
                {...props.rawProps}
            />
        )}
    />
));

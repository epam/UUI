import React, { KeyboardEvent } from 'react';
import FocusLock from 'react-focus-lock';
import cx from 'classnames';
import { Dropdown, MainMenuDropdownProps } from '@epam/uui-components';
import { MainMenuButton } from './MainMenuButton';
import css from './MainMenuDropdown.module.scss';

export function MainMenuDropdown(props: MainMenuDropdownProps) {
    const handleEscape = (e: KeyboardEvent<HTMLElement>, onClose: () => void, isOpen: boolean) => {
        if (e.key === 'Escape' && isOpen) {
            onClose();
        }
    };

    return (
        <Dropdown
            renderTarget={ (dropdownProps) => (
                <MainMenuButton
                    caption={ props.caption }
                    { ...dropdownProps }
                    rawProps={ props.rawProps }
                    isLinkActive={ props.isLinkActive }
                    isDropdown
                />
            ) }
            renderBody={ (dropdownBodyProps) => (
                <FocusLock
                    returnFocus
                    persistentFocus
                    lockProps={ {
                        onKeyDown: (e: KeyboardEvent<HTMLElement>) => handleEscape(e, dropdownBodyProps.onClose, dropdownBodyProps.isOpen),
                    } }
                >
                    <div className={ cx(css.dropdownBody, 'uui-main_menu-dropdown', props.cx) }>
                        {props.renderBody({ ...dropdownBodyProps })}
                    </div>
                </FocusLock>
            ) }
            placement="bottom-start"
        />
    );
}

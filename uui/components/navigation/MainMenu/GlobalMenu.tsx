import * as React from 'react';
import cx from 'classnames';
import { IAdaptiveItem, IHasCX, IHasRawProps } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { ReactComponent as GlobalMenuIcon } from '@epam/assets/icons/navigation-global_menu-outline-outline.svg';
import css from './GlobalMenu.module.scss';

/** Represents the properties of the GlobalMenu component. */
export interface GlobalMenuProps extends IAdaptiveItem, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLButtonElement>>, React.RefAttributes<HTMLButtonElement> {}

export function GlobalMenu(props: GlobalMenuProps) {
    return (
        <button ref={ props.ref } id="global_menu_toggle" className={ cx(css.globalMenuBtn, props.cx) } { ...props.rawProps }>
            <IconContainer size={ 36 } icon={ GlobalMenuIcon } cx={ css.globalMenuIcon } />
        </button>
    );
}

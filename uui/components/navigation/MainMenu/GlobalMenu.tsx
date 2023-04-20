import * as React from 'react';
import cx from 'classnames';
import { IAdaptiveItem, IHasCX, IHasRawProps } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { ReactComponent as GlobalMenuIcon } from '../../../icons/global_menu.svg';
import css from './GlobalMenu.scss';

export interface GlobalMenuProps extends IAdaptiveItem, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLButtonElement>> {}

export const GlobalMenu = React.forwardRef<HTMLButtonElement, GlobalMenuProps>((props, ref) => (
    <button ref={ ref } id="global_menu_toggle" className={ cx(css.globalMenuBtn, props.cx) } { ...props.rawProps }>
        <IconContainer icon={ GlobalMenuIcon } cx={ css.globalMenuIcon } />
    </button>
));

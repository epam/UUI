import * as React from 'react';
import { Icon, IAdaptiveItem, cx } from '@epam/uui-core';
import { ButtonProps } from '@epam/uui-components';
import { IconButton } from '../../buttons';
import css from './MainMenuIcon.module.scss';

export interface MainMenuIconProps extends ButtonProps, IAdaptiveItem {
    icon: Icon;
}

export const MainMenuIcon = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, MainMenuIconProps>((props, ref) => (
    <IconButton ref={ ref } icon={ props.icon } cx={ cx(props.cx, css.container) } { ...props } />
));

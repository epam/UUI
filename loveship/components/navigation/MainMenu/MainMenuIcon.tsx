import React from 'react';
import { Icon, IAdaptiveItem, cx } from '@epam/uui-core';
import { ButtonProps } from '@epam/uui-components';
import { IconButton } from '../../buttons';
import css from './MainMenuIcon.scss';

export interface MainMenuIconProps extends ButtonProps, IAdaptiveItem {
    icon: Icon;
}

export const MainMenuIcon = React.forwardRef<HTMLDivElement, MainMenuIconProps>((props: MainMenuIconProps, ref) => (
    <IconButton ref={ ref } icon={ props.icon } cx={ cx(props.cx, css.container) } { ...props } />
));

MainMenuIcon.displayName = 'MainMenuIcon';

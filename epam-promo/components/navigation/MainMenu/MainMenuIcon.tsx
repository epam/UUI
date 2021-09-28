import * as React from 'react';
import { Icon, IAdaptiveItem, cx } from '@epam/uui';
import { ButtonProps } from '@epam/uui-components';
import { IconButton } from '../../buttons';
import * as css from './MainMenuIcon.scss';

export interface MainMenuIconProps extends ButtonProps, IAdaptiveItem {
    icon: Icon;
}

export const MainMenuIcon = (props: MainMenuIconProps) => (
    <IconButton icon={ props.icon } cx={ cx(props.cx, css.container) } { ...props } />
);
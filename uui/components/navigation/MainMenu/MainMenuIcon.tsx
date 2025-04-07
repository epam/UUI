import * as React from 'react';
import { Icon, IAdaptiveItem, cx } from '@epam/uui-core';
import { ButtonProps } from '@epam/uui-components';
import { IconButton } from '../../buttons';
import css from './MainMenuIcon.module.scss';

/** Represents the properties of the MainMenuIcon component. */
export type MainMenuIconProps = ButtonProps & IAdaptiveItem & React.RefAttributes<HTMLButtonElement | HTMLAnchorElement> & {
    /*
    * Defines component icon.
    */
    icon: Icon;
};

export function MainMenuIcon(props: MainMenuIconProps) {
    return (
        <IconButton ref={ props.ref } icon={ props.icon } cx={ cx(props.cx, css.container) } { ...props } />
    );
}

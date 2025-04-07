import * as React from 'react';
import cx from 'classnames';
import { IAdaptiveItem, IDropdownToggler, Icon, IHasCX, uuiMarkers, IClickable, IHasRawProps } from '@epam/uui-core';
import { IconContainer, Avatar } from '@epam/uui-components';
import { ReactComponent as FoldingArrow } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import css from './MainMenuAvatar.module.scss';

/** Represents the properties of the MainMenuAvatar component. */
export interface MainMenuAvatarProps extends IClickable, IAdaptiveItem, IDropdownToggler, IHasCX,
    IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>>, React.RefAttributes<HTMLButtonElement> {
    avatarUrl?: string;
    icon?: Icon;
}

export function MainMenuAvatar(props: MainMenuAvatarProps) {
    return (
        <button
            ref={ props.ref }
            className={ cx(css.container, props.isDropdown && css.dropdown, props.isOpen && css.open, props.onClick && uuiMarkers.clickable, props.cx) }
            onClick={ props.onClick }
            { ...props.rawProps }
        >
            <Avatar size="36" img={ props.avatarUrl } />
            {props.icon && <IconContainer icon={ props.icon } />}
            {props.isDropdown && (
                <div>
                    <IconContainer size={ 18 } icon={ FoldingArrow } flipY={ props.isOpen } cx={ css.foldingArrow } />
                </div>
            )}
        </button>
    );
}

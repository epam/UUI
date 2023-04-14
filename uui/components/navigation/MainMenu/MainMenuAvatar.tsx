import * as React from 'react';
import css from './MainMenuAvatar.scss';
import cx from 'classnames';
import { IAdaptiveItem, IDropdownToggler, Icon, IHasCX, uuiMarkers } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import { ReactComponent as FoldingArrow } from '../../../icons/folding-arrow-18.svg';
import { Avatar } from '@epam/uui-components';

export interface MainMenuAvatarProps extends IAdaptiveItem, IDropdownToggler, IHasCX {
    avatarUrl?: string;
    icon?: Icon;
}

export const MainMenuAvatar = React.forwardRef<HTMLButtonElement, MainMenuAvatarProps>((props, ref) => (
    <button
        ref={ ref }
        className={ cx(css.container, props.isDropdown && css.dropdown, props.isOpen && css.open, props.onClick && uuiMarkers.clickable, props.cx) }
        onClick={ props.onClick }
    >
        <Avatar size='36' img={ props.avatarUrl } />
        { props.icon && <IconContainer icon={ props.icon } /> }
        { props.isDropdown && (
            <div>
                <IconContainer icon={ FoldingArrow } flipY={ props.isOpen } />
            </div>
        ) }
    </button>
));

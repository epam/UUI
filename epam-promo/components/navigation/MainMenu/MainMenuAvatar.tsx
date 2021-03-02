import * as React from 'react';
import * as css from './MainMenuAvatar.scss';
import cx from 'classnames';
import { IAdaptiveItem, IDropdownToggler, Icon, IHasCX } from '@epam/uui';
import { IconContainer } from '@epam/uui-components';
import * as foldingArrow from '../../../icons/folding-arrow-18.svg';
import { Avatar } from '@epam/uui-components';

export interface MainMenuAvatarProps extends IAdaptiveItem, IDropdownToggler, IHasCX {
    avatarUrl?: string;
    icon?: Icon;
}

export class MainMenuAvatar extends React.Component<MainMenuAvatarProps, {}> {
    render() {
        return (
            <div
                className={ cx(css.container, this.props.isDropdown && css.dropdown, this.props.isOpen && css.open, this.props.cx) }
                onClick={ this.props.onClick }
            >
                <Avatar cx={ css.photo } size='36' img={ this.props.avatarUrl }/>
                { this.props.icon && <IconContainer icon={ this.props.icon } /> }
                { this.props.isDropdown && (
                    <div className={ css.dropdownIcon }>
                        <IconContainer icon={ foldingArrow } flipY={ this.props.isOpen } />
                    </div>
                ) }
            </div>
        );
    }
}

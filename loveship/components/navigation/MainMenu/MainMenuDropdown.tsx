import React from 'react';
import cx from 'classnames';
import { Dropdown, MainMenuDropdownProps } from '@epam/uui-components';
import { DropdownMenuBody } from '../../overlays';
import { MainMenuButton } from './MainMenuButton';
import * as css from './MainMenuDropdown.scss';

export class MainMenuDropdown extends React.Component<MainMenuDropdownProps> {
    render() {
        return (
            <Dropdown
                renderTarget={ props => (
                    <MainMenuButton
                        { ...props }
                        caption={ this.props.caption }
                        cx={ cx(props.isOpen && css.open, this.props.cx) }
                        rawProps={ this.props.rawProps }
                        isLinkActive={ this.props.isLinkActive }
                        isDropdown
                    />
                    ) }
                renderBody={ (props) => (
                    <DropdownMenuBody color='night' inMainMenu>
                        { React.Children.map(this.props.children, (item: any) => 
                             !!item && React.createElement(item.type, {
                                 ...item.props,
                                 onClick: () => {
                                     item.props.onClick?.();
                                     props.onClose();
                                 },
                             }),
                        ) }
                    </DropdownMenuBody>
                ) }
                placement='bottom-start'
            />
        );
    }
}

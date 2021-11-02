import React from 'react';
import cx from 'classnames';
import { Dropdown, MainMenuDropdownProps } from '@epam/uui-components';
import {IDropdownToggler, IHasCaption, ICanRedirect, CX, IHasCX} from '@epam/uui';
import * as css from './MainMenuDropdown.scss';
import { DropdownMenuBody } from '../../overlays';
import { MainMenuButton } from './MainMenuButton';

interface MainMenuDropdownButtonProps extends IDropdownToggler, IHasCaption, ICanRedirect, IHasCX {}

class MainMenuDropdownButton extends React.Component<MainMenuDropdownButtonProps, {}> {
    render() {
        return (
            <MainMenuButton
                { ...this.props }
                cx={ cx(this.props.isOpen && css.open, this.props.cx) }
                isDropdown
            />
        );
    }
}

export class MainMenuDropdown extends React.Component<MainMenuDropdownProps, {}> {
    render() {
        return (
            <Dropdown
                renderTarget={ props => (
                    <MainMenuDropdownButton
                        caption={ this.props.caption }
                        cx={ this.props.cx }
                        { ...props }
                        isLinkActive={ this.props.isLinkActive }
                        isDropdown
                    />
                    ) }
                renderBody={ (props) => (
                    <DropdownMenuBody color="night" inMainMenu>
                        { React.Children.map(this.props.children, (item: any) => {
                            if (!item) {
                                return item;
                            }
                            const itemProps = {
                                ...item.props,
                                onClick: () => {
                                    item.props.onClick && item.props.onClick();
                                    props.onClose();
                                },
                            };

                            return React.createElement(item.type, itemProps);
                        }) }
                    </DropdownMenuBody>
                ) }
                placement="bottom-start"
            />
        );
    }
}

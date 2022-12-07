import React from 'react';
import cx from 'classnames';
import { Dropdown, MainMenuDropdownProps } from '@epam/uui-components';
import { DropdownMenuBody } from '../../overlays';
import { MainMenuButton } from './MainMenuButton';
import css from './MainMenuDropdown.scss';

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
                    />
                    ) }
                renderBody={ (props) => (
                    <DropdownMenuBody color='night' inMainMenu cx={ css.dropdownContainer }>
                        { React.Children.map(this.props.children, (item: any) => {
                            if (!item) {
                                return item;
                            }
                            const itemProps = {
                                ...item.props,
                                onClick: item.props.onClick ? () => {
                                    item.props.onClick();
                                    props.onClose();
                                }: null
                            };

                            return React.createElement(item.type, itemProps);
                        }) }
                    </DropdownMenuBody>
                ) }
                placement='bottom-start'
            />
        );
    }
}

import * as React from 'react';
import cx from 'classnames';
import { Dropdown, MainMenuDropdownProps } from '@epam/uui-components';
import * as css from './MainMenuDropdown.scss';
import { MainMenuButton } from './MainMenuButton';

export class MainMenuDropdown extends React.Component<MainMenuDropdownProps, {}> {
    render() {
        return (
            <Dropdown
                renderTarget={ props => <MainMenuButton caption={ this.props.caption } { ...props } isLinkActive={ this.props.isLinkActive } isDropdown/> }
                renderBody={ (props) => (
                    <div className={ cx(css.dropdownBody) }>
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
                    </div>
                ) }
                placement="bottom-start"
            />
        );
    }
}

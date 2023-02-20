import * as React from 'react';
import cx from 'classnames';
import { Dropdown, MainMenuDropdownProps } from '@epam/uui-components';
import css from './MainMenuDropdown.scss';
import { MainMenuButton } from './MainMenuButton';

export class MainMenuDropdown extends React.Component<MainMenuDropdownProps> {
    render() {
        return (
            <Dropdown
                renderTarget={props => (
                    <MainMenuButton
                        caption={this.props.caption}
                        {...props}
                        rawProps={this.props.rawProps}
                        isLinkActive={this.props.isLinkActive}
                        isDropdown
                    />
                )}
                renderBody={props => (
                    <div className={cx(css.dropdownBody)}>
                        {React.Children.map<React.ReactElement, React.ReactElement>(this.props.children as React.ReactElement[], item => {
                            if (!item) return item;
                            return React.createElement(item.type, {
                                ...item.props,
                                onClick: item.props.onClick
                                    ? () => {
                                          item.props.onClick();
                                          props.onClose();
                                      }
                                    : null,
                            });
                        })}
                    </div>
                )}
                placement="bottom-start"
            />
        );
    }
}

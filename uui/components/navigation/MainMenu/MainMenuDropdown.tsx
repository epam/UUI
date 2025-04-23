import * as React from 'react';
import FocusLock from 'react-focus-lock';
import cx from 'classnames';
import { Dropdown, MainMenuDropdownProps } from '@epam/uui-components';
import { MainMenuButton } from './MainMenuButton';
import css from './MainMenuDropdown.module.scss';

export class MainMenuDropdown extends React.Component<MainMenuDropdownProps> {
    render() {
        return (
            <Dropdown
                renderTarget={ (props) => (
                    <MainMenuButton
                        caption={ this.props.caption }
                        { ...props }
                        rawProps={ this.props.rawProps }
                        isLinkActive={ this.props.isLinkActive }
                        isDropdown
                    />
                ) }
                renderBody={ (props) => {
                    const handleEscape = (e: React.KeyboardEvent<HTMLElement>) => {
                        if (e.key === 'Escape' && props.isOpen) {
                            props.onClose();
                        }
                    };

                    return (
                        <FocusLock returnFocus persistentFocus lockProps={ { onKeyDown: handleEscape } }>
                            <div className={ cx(css.dropdownBody, 'uui-main_menu-dropdown') }>
                                {this.props.renderBody
                                    ? this.props.renderBody({ ...props })
                                    : React.Children.map<React.ReactElement<any>, React.ReactElement<any>>(this.props.children as React.ReactElement<any>[], (item) => {
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
                        </FocusLock>
                    );
                } }
                placement="bottom-start"
            />
        );
    }
}

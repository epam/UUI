import * as React from 'react';
import { BurgerButton, GlobalMenu, MainMenu, MainMenuAvatar, MainMenuButton, MainMenuIcon, FlexSpacer, FlexCell } from "@epam/promo";
import * as helpIcon from "@epam/assets/icons/common/notification-help-outline-24.svg";
import { MainMenuCustomElement, Dropdown } from "@epam/uui-components";
import { DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter, MainMenuDropdown, MainMenuSearch } from "@epam/loveship";

export class MainMenuCustomElementsExample extends React.Component {
    renderBurger = () => (
        <>
            <BurgerButton caption="News" />
            <BurgerButton caption="My Profile" />
            <BurgerButton caption="Dashboards" />
            <BurgerButton caption="Impact" />
            <BurgerButton caption="ENGX" />
            <BurgerButton caption="Cloud" />
            <BurgerButton caption="Help" />
            <BurgerButton caption="Settings" />
            <BurgerButton caption="Log out" />
        </>
    )

    render() {
        return (
            <FlexCell grow={ 1 }>
                <MainMenu
                    appLogoUrl="/static/images/app-logos/heroes_logo.svg"
                    renderBurger={ this.renderBurger }
                >
                    <MainMenuButton collapseToMore caption="News" priority={ 5 } estimatedWidth={ 67 } />
                    <MainMenuButton collapseToMore caption="My Profile" priority={ 2 } estimatedWidth={ 102 } />
                    <MainMenuDropdown caption="Dashboards" priority={ 2 } estimatedWidth={ 128 }>
                        <MainMenuButton collapseToMore caption="Impact" />
                        <MainMenuButton collapseToMore caption="ENGX" />
                        <MainMenuButton collapseToMore caption="Cloud" />
                    </MainMenuDropdown>

                    <FlexSpacer priority={ 100500 } />
                    <MainMenuCustomElement estimatedWidth={ 94 } priority={ 12 }>
                        <div style={ { alignSelf: 'flex-start' } }>
                            <img
                                style={ {
                                    padding: '0 16px',
                                    cursor: 'pointer',
                                } }
                                src="/static/images/give_badge.svg"
                                alt="give-badge-image"
                            />
                        </div>
                    </MainMenuCustomElement>
                    <FlexSpacer priority={ 100500 } />
                    <MainMenuSearch
                        priority={ 11 }
                        estimatedWidth={ 200 }
                        value={ '' }
                        placeholder="Search here..."
                        onValueChange={ () => null }
                        onCancel={ () => this.setState({ searchQuery: '' }) }
                    />
                    <MainMenuIcon caption="Help" icon={ helpIcon } priority={ 11 } estimatedWidth={ 60 } />
                    <MainMenuCustomElement priority={ 11 } estimatedWidth={ 84 }>
                        <Dropdown
                            renderTarget={ props => (
                                <MainMenuAvatar
                                    avatarUrl="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50"
                                    isDropdown
                                    { ...props }
                                />
                            ) }
                            renderBody={ () => (
                                <DropdownMenuBody color="white">
                                    <DropdownMenuButton noIcon caption="Settings" />
                                    <DropdownMenuSplitter />
                                    <DropdownMenuButton noIcon caption="Log out" />
                                </DropdownMenuBody>
                            ) }
                            placement="bottom-end"
                        />
                    </MainMenuCustomElement>
                    <GlobalMenu estimatedWidth={ 60 } priority={ 100500 } />
                </MainMenu>
            </FlexCell>
        );
    }
}
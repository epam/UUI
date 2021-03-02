import * as React from 'react';
import { BurgerButton, GlobalMenu, MainMenu, MainMenuAvatar, MainMenuButton, MainMenuIcon, FlexSpacer, FlexCell } from "@epam/promo";
import * as helpIcon from "@epam/assets/icons/common/notification-help-outline-24.svg";
import { MainMenuCustomElement, Dropdown } from "@epam/uui-components";
import {BurgerGroupHeader, BurgerSearch, DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter, Slider} from "@epam/loveship";
import * as pinIcon from '@epam/assets/icons/common/action-pin_on-24.svg';

interface MainMenuResponsiveExampleState {
    width: number;
    burgerSearchQuery: string;
}

export class MainMenuResponsiveExample extends React.Component<any, MainMenuResponsiveExampleState> {
    state = {
        width: 100,
        burgerSearchQuery: '',
    };

    renderBurger = () => (
        <>
            <BurgerSearch
                value={ this.state.burgerSearchQuery }
                onValueChange={ newVal => this.setState({ burgerSearchQuery: newVal }) }
                placeholder="Type to search"
                onCancel={ () => this.setState({ burgerSearchQuery: '' }) }
            />
            <BurgerButton caption="Projects" isDropdown />
            <BurgerButton caption="On scope" type="secondary" />
            <BurgerButton caption="On budget" type="secondary" />
            <BurgerButton caption="On hold" type="secondary" />
            <BurgerButton caption="People" />
            <BurgerButton caption="Positions" />
            <BurgerButton caption="Companies" />
            <BurgerButton caption="Processes" />
            <BurgerButton caption="Tasks" />
            <BurgerGroupHeader caption="Other" />
            <BurgerButton caption="Help" />
            <BurgerButton caption="Settings" />
            <BurgerButton caption="Log out" />
        </>
    )

    render() {
        return (
            <FlexCell grow={ 1 }>
                <Slider
                    value={ this.state.width }
                    onValueChange={ (newVal) => this.setState({ width: newVal }) }
                    min={ 0 }
                    max={ 100 }
                    step={ 1 }
                />

                <div style={ { width: `${this.state.width}%`, marginTop: 12 } }>
                    <MainMenu
                        appLogoUrl="/static/images/app-logos/telescope_logo.svg"
                        renderBurger={ this.renderBurger }
                    >
                        <MainMenuButton collapseToMore caption="People" priority={ 8 } estimatedWidth={ 76 } />
                        <MainMenuButton collapseToMore caption="Projects" priority={ 7 } estimatedWidth={ 91 } />
                        <MainMenuButton collapseToMore caption="Positions" priority={ 6 } estimatedWidth={ 95 } />
                        <MainMenuButton collapseToMore caption="Companies" priority={ 5 } estimatedWidth={ 101 } />
                        <MainMenuButton collapseToMore caption="Processes" priority={ 4 } estimatedWidth={ 101 } />
                        <MainMenuButton collapseToMore caption="Tasks" priority={ 3 } estimatedWidth={ 70 } />
                        <MainMenuButton collapseToMore caption="Talks" priority={ 2 } estimatedWidth={ 69 } />
                        <MainMenuButton collapseToMore caption="Action Items" priority={ 1 } estimatedWidth={ 115 } />
                        <MainMenuButton collapseToMore caption="Subscriptions" priority={ 0 } estimatedWidth={ 128 } />
                        <FlexSpacer priority={ 100500 } />
                        <MainMenuIcon icon={ pinIcon } priority={ 10 } estimatedWidth={ 60 } />
                        <MainMenuIcon icon={ helpIcon } priority={ 10 } estimatedWidth={ 60 } />
                        <MainMenuCustomElement priority={ 10 } estimatedWidth={ 84 }>
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
                </div>
            </FlexCell>

        );
    }
}
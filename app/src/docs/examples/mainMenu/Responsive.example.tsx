import React, { ReactNode, useState } from 'react';
import { BurgerButton, GlobalMenu, MainMenu, MainMenuAvatar, MainMenuButton, MainMenuIcon, FlexSpacer, FlexCell,
    BurgerGroupHeader, BurgerSearch, DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter, Slider } from "@epam/promo";
import { MainMenuCustomElement, Dropdown } from "@epam/uui-components";
import { ReactComponent as HelpIcon } from "@epam/assets/icons/common/notification-help-outline-24.svg";
import { ReactComponent as PinIcon } from '@epam/assets/icons/common/action-pin_on-24.svg';

export default function MainMenuResponsiveExample() {
    const [width, setWidth] = useState<number>(100);
    const [burgerSearchQuery, setBurgerSearchQuery] = useState<string>('');

    const renderBurger = (): ReactNode => (
        <>
            <BurgerSearch
                value={ burgerSearchQuery }
                onValueChange={ setBurgerSearchQuery }
                placeholder="Type to search"
                onCancel={ () => setBurgerSearchQuery('') }
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
    );

    return (
        <FlexCell grow={ 1 }>
            <Slider
                value={ width }
                onValueChange={ setWidth }
                min={ 0 }
                max={ 100 }
                step={ 1 }
            />

            <div style={ { width: `${width}%`, marginTop: 12 } }>
                <MainMenu
                    appLogoUrl="/static/images/app-logos/telescope_logo.svg"
                    renderBurger={ renderBurger }
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
                    <MainMenuIcon icon={ PinIcon } priority={ 10 } estimatedWidth={ 60 } />
                    <MainMenuIcon icon={ HelpIcon } priority={ 10 } estimatedWidth={ 60 } />
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
                                <DropdownMenuBody onClose={ () => {} }>
                                    <DropdownMenuButton caption="Settings" />
                                    <DropdownMenuSplitter />
                                    <DropdownMenuButton caption="Log out" />
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
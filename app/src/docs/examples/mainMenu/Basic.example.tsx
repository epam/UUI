 import React from 'react';
import {
    BurgerButton, GlobalMenu, MainMenu, MainMenuAvatar, MainMenuButton, MainMenuIcon, FlexSpacer, FlexCell,
    DropdownMenuButton, DropdownMenuSplitter, DropdownMenuBody,
} from "@epam/promo";
import { MainMenuCustomElement, Dropdown } from "@epam/uui-components";
import { ReactComponent as HelpIcon } from "@epam/assets/icons/common/notification-help-outline-24.svg";

export default function MainMenuBasicExample() {
    const renderBurger = () => (
        <>
            <BurgerButton caption="Training Catalog" />
            <BurgerButton caption="Requests" />
            <BurgerButton caption="Help" />
            <BurgerButton caption="Settings" />
            <BurgerButton caption="Log out" />
        </>
    );

    return (
        <FlexCell grow={ 1 }>
            <MainMenu
                appLogoUrl="/static/images/app-logos/learn_logo.svg"
                logoHref='https://learn.epam.com/'
                renderBurger={ renderBurger }
            >
                <MainMenuButton collapseToMore caption="Training Catalog" priority={ 3 } estimatedWidth={ 145 }  />
                <MainMenuButton collapseToMore caption="Requests" priority={ 3 } estimatedWidth={ 93 } />
                <FlexSpacer priority={ 100500 } />
                <MainMenuIcon href='https://support.epam.com' target="_blank" icon={ HelpIcon } onClick={ () => {} } priority={ 10 } estimatedWidth={ 60 } />
                <MainMenuCustomElement priority={ 10 } estimatedWidth={ 80 }>
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
        </FlexCell>
    );
}
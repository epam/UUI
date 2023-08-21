import React from 'react';
import { BurgerButton, GlobalMenu, MainMenu, MainMenuAvatar, MainMenuButton, MainMenuIcon, FlexSpacer, FlexCell,
    DropdownMenuButton, DropdownMenuSplitter, DropdownMenuBody, Burger,
} from '@epam/promo';
import { Dropdown, AdaptiveItemProps, MainMenuLogo } from '@epam/uui-components';
import { ReactComponent as HelpIcon } from '@epam/assets/icons/common/notification-help-outline-24.svg';

export default function MainMenuBasicExample() {
    const renderBurger = (props: { onClose: () => void }) => (
        <>
            <BurgerButton
                href="/"
                caption="Training Catalog"
                onClick={ () => {
                    props.onClose && props.onClose();
                } }
            />
            <BurgerButton
                href="/"
                caption="Requests"
                onClick={ () => {
                    props.onClose && props.onClose();
                } }
            />
            <BurgerButton
                href="/"
                caption="Help"
                onClick={ () => {
                    props.onClose && props.onClose();
                } }
            />
            <BurgerButton
                href="/"
                caption="Settings"
                onClick={ () => {
                    props.onClose && props.onClose();
                } }
            />
            <BurgerButton
                href="/"
                caption="Log out"
                onClick={ () => {
                    props.onClose && props.onClose();
                } }
            />
        </>
    );

    const renderAvatar = () => {
        return (
            <Dropdown
                key="avatar"
                renderTarget={ (props) => (
                    <MainMenuAvatar avatarUrl="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50" isDropdown { ...props } />
                ) }
                renderBody={ (props) => (
                    <DropdownMenuBody { ...props }>
                        <DropdownMenuButton caption="Settings" />
                        <DropdownMenuSplitter />
                        <DropdownMenuButton caption="Log out" />
                    </DropdownMenuBody>
                ) }
                placement="bottom-end"
            />
        );
    };

    const getMenuItems = (): AdaptiveItemProps[] => {
        return [
            {
                id: 'burger', priority: 100, collapsedContainer: true, render: (p) => <Burger key={ p.id } width={ 300 } renderBurgerContent={ renderBurger } />,
            },
            {
                id: 'logo',
                priority: 99,
                render: (p) => <MainMenuLogo key={ p.id } href="https://learn.epam.com/" logoUrl="https://uui.epam.com/static/images/app-logos/learn_logo.svg" />,
            },
            { id: 'trainingCatalog', priority: 3, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Training Catalog" /> },
            { id: 'requests', priority: 3, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Requests" /> },
            { id: 'flexSpacer', priority: 100, render: (p) => <FlexSpacer key={ p.id } /> },
            { id: 'help', priority: 1, render: (p) => <MainMenuIcon key={ p.id } href="https://support.epam.com" target="_blank" icon={ HelpIcon } /> },
            { id: 'avatar', priority: 2, render: renderAvatar },
            { id: 'globalMenu', priority: 100, render: (p) => <GlobalMenu key={ p.id } /> },
        ];
    };

    return (
        <FlexCell grow={ 1 }>
            <MainMenu items={ getMenuItems() } />
        </FlexCell>
    );
}

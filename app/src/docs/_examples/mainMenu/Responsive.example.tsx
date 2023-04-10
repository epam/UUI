import React, { ReactNode, useState } from 'react';
import {
    BurgerButton, GlobalMenu, MainMenu, MainMenuAvatar, MainMenuButton, MainMenuIcon, FlexSpacer, FlexCell,
    MainMenuDropdown, BurgerSearch, DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter, Slider, Burger,
} from "@epam/promo";
import { Dropdown, MainMenuLogo, AdaptiveItemProps } from "@epam/uui-components";
import { ReactComponent as HelpIcon } from "@epam/assets/icons/common/notification-help-outline-24.svg";
import { ReactComponent as PinIcon } from '@epam/assets/icons/common/action-pin_on-24.svg';

export default function MainMenuResponsiveExample() {
    const [width, setWidth] = useState<number>(100);
    const [burgerSearchQuery, setBurgerSearchQuery] = useState<string>('');

    const renderBurger = (hiddenItems: AdaptiveItemProps<{caption?: string}>[]): ReactNode => (
        <>
            <BurgerSearch
                value={ burgerSearchQuery }
                onValueChange={ setBurgerSearchQuery }
                placeholder="Type to search"
                onCancel={ () => setBurgerSearchQuery('') }
            />
            { hiddenItems.filter(i => i.caption).map(i => <BurgerButton caption={ i.caption } />) }
        </>
    );

    const renderAvatar = () => {
        return (
            <Dropdown
                renderTarget={ props => (
                    <MainMenuAvatar
                        avatarUrl="https://avatars.dicebear.com/api/human/avatar12.svg?background=%23EBEDF5&radius=50"
                        isDropdown
                        { ...props }
                    />
                ) }
                renderBody={ props => (
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

    const getMenuItems = (): AdaptiveItemProps<{caption?: string}>[] => {
        return [
            { id: 'burger', priority: 100, collapsedContainer: true, render: (item, hiddenItems) => <Burger
                    renderBurgerContent={ () => renderBurger(hiddenItems) }
                />,
            },
            { id: 'logo', priority: 99, render: () => <MainMenuLogo
                    href='https://learn.epam.com/'
                    logoUrl='https://uui.epam.com/static/images/app-logos/learn_logo.svg'
                />,
            },
            { id: 'People', priority: 9, render: () => <MainMenuButton href='/' caption="People" />, caption: "People" },
            { id: 'Projects', priority: 7, render: () => <MainMenuButton caption="Projects" />, caption: "Projects" },
            { id: 'Positions', priority: 6, render: () => <MainMenuButton href='/' caption="Positions" />, caption: "Positions" },
            { id: 'Companies', priority: 5, render: () => <MainMenuButton href='/' caption="Companies" />, caption: "Companies" },
            { id: 'Processes', priority: 5, render: () => <MainMenuButton href='/' caption="Processes" />, caption: "Processes" },
            { id: 'Tasks', priority: 4, render: () => <MainMenuButton href='/' caption="Tasks" />, caption: "Tasks" },
            { id: 'Talks', priority: 4, render: () => <MainMenuButton href='/' caption="Talks" />, caption: "Talks" },
            {
                id: 'Action Items', priority: 3, render: (item, hiddenItems, displayedItems, dropdownBodyProps) => <MainMenuButton caption="Action Items" onClick={ () => {
                    dropdownBodyProps.onClose();
                } } />, caption: "Action Items",
            },
            { id: 'Subscriptions', priority: 3, render: () => <MainMenuButton href='/' caption="Subscriptions" />, caption: "Subscriptions" },
            { id: 'moreContainer', priority: 8, collapsedContainer: true, render: (item, hiddenItems) => <MainMenuDropdown
                    caption='More'
                    renderBody={ (props) => {
                        return hiddenItems?.map(i => i.render(item, null, null, props));
                    } }
                />,
            },
            { id: 'flexSpacer', priority: 100, render: () => <FlexSpacer />},
            { id: 'pinIcon', priority: 8, render: () => <MainMenuIcon icon={ PinIcon } /> },
            { id: 'helpIcon', priority: 8, render: () => <MainMenuIcon icon={ HelpIcon } /> },
            { id: 'avatar', priority: 9, render: renderAvatar },
            { id: 'globalMenu', priority: 100, render: () => <GlobalMenu /> },
        ];
    };

    return (
        <FlexCell grow={ 1 }>
            <Slider value={ width } onValueChange={ setWidth } min={ 0 } max={ 100 } step={ 1 } />

            <div style={ { width: `${width}%`, marginTop: 12 } }>
                <MainMenu items={ getMenuItems() } />
            </div>
        </FlexCell>
    );
}
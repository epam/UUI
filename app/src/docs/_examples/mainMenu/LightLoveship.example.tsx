import React, { ReactNode, useState } from 'react';
import {
    Slider, BurgerButton, GlobalMenu, MainMenuAvatar, MainMenuButton, MainMenuIcon, FlexSpacer, FlexCell,
    BurgerSearch, DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter, Burger, BurgerGroupHeader, MainMenuSearch,
} from '@epam/uui';
import { MainMenu, MainMenuDropdown } from '@epam/loveship';
import { Dropdown, MainMenuLogo, AdaptiveItemProps } from '@epam/uui-components';
import { ReactComponent as HelpIcon } from '@epam/assets/icons/common/notification-help-outline-24.svg';
import { ReactComponent as PinIcon } from '@epam/assets/icons/common/action-pin_on-24.svg';

export default function MainMenuResponsiveExample() {
    const [width, setWidth] = useState<number>(100);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const renderBurger = (hiddenItems: AdaptiveItemProps<{ caption?: string }>[], onClose?: () => void): ReactNode => (
        <>
            <BurgerSearch value={ searchQuery } onValueChange={ setSearchQuery } placeholder="Type to search" onCancel={ () => setSearchQuery('') } />
            <BurgerGroupHeader caption="Burger" />
            {hiddenItems
                .filter((i) => i.caption)
                .map((i) => {
                    return (
                        <BurgerButton
                            href="/"
                            caption={ i.caption }
                            onClick={ () => {
                                // here your code
                                onClose && onClose();
                            } }
                        />
                    );
                })}
        </>
    );

    const renderAvatar = () => {
        return (
            <Dropdown
                key="avatar"
                renderTarget={ (props) => (
                    <MainMenuAvatar avatarUrl="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" rawProps={ { 'aria-label': 'User avatar' } } isDropdown { ...props } />
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

    const getMenuItems = (): AdaptiveItemProps<{ caption?: string; onClose?: () => void }>[] => {
        return [
            {
                id: 'burger',
                priority: 100,
                collapsedContainer: true,
                render: (item, hiddenItems) => <Burger key={ item.id } renderBurgerContent={ (props) => renderBurger(hiddenItems, props.onClose) } />,
            },
            {
                id: 'logo',
                priority: 99,
                render: (p) => <MainMenuLogo key={ p.id } href="https://learn.epam.com/" logoUrl="/static/images/app-logos/learn_dark_logo.svg" />,
            },
            {
                id: 'People', priority: 7, render: (p) => <MainMenuButton key={ p.id } href="/" caption="People" />, caption: 'People',
            },
            {
                id: 'Projects', priority: 7, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Projects" />, caption: 'Projects',
            },
            {
                id: 'Positions', priority: 6, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Positions" isLinkActive />, caption: 'Positions',
            },
            {
                id: 'Companies', priority: 5, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Companies" />, caption: 'Companies',
            },
            {
                id: 'Processes', priority: 5, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Processes" />, caption: 'Processes',
            },
            {
                id: 'Tasks', priority: 4, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Tasks" />, caption: 'Tasks',
            },
            {
                id: 'Talks', priority: 4, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Talks" />, caption: 'Talks',
            },
            {
                id: 'Action Items',
                priority: 3,
                render: (item) => (
                    <MainMenuButton
                        key={ item.id }
                        href="/"
                        caption="Action Items"
                        onClick={ () => {
                            item.onClose && item.onClose();
                        } }
                    />
                ),
                caption: 'Action Items',
            },
            {
                id: 'Subscriptions', priority: 3, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Subscriptions" />, caption: 'Subscriptions',
            },
            {
                id: 'moreContainer',
                priority: 9,
                collapsedContainer: true,
                render: (item, hiddenItems) => (
                    <MainMenuDropdown
                        color="white"
                        caption="More"
                        key={ item.id }
                        renderBody={ (props) => {
                            return hiddenItems?.map((i) => i.render({ ...i, onClose: props.onClose }));
                        } }
                    />
                ),
            },
            { id: 'flexSpacer', priority: 100, render: (p) => <FlexSpacer key={ p.id } /> },
            { id: 'search', priority: 9, render: (p) => <div style={ { display: 'flex' } }><MainMenuSearch key={ p.id } value={ searchQuery } onValueChange={ setSearchQuery } /></div> },
            { id: 'pinIcon', priority: 9, render: (p) => <MainMenuIcon key={ p.id } icon={ PinIcon } rawProps={ { 'aria-label': 'Pin' } } onClick={ () => {} } /> },
            { id: 'helpIcon', priority: 9, render: (p) => <MainMenuIcon key={ p.id } icon={ HelpIcon } rawProps={ { 'aria-label': 'Help' } } onClick={ () => {} } /> },
            { id: 'avatar', priority: 10, render: renderAvatar },
            { id: 'globalMenu', priority: 100, render: (p) => <GlobalMenu key={ p.id } rawProps={ { 'aria-label': 'Global Menu' } } /> },
        ];
    };

    return (
        <FlexCell grow={ 1 }>
            <Slider value={ width } onValueChange={ setWidth } min={ 0 } max={ 100 } step={ 1 } />

            <div style={ { width: `${width}%`, marginTop: 12 } }>
                <MainMenu color="white" items={ getMenuItems() } />
            </div>
        </FlexCell>
    );
}

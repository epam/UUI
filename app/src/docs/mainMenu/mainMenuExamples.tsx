import * as React from 'react';
import {
    Burger,
    BurgerButton,
    DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter,
    FlexSpacer,
    GlobalMenu,
    MainMenuAvatar,
    MainMenuButton,
    MainMenuIcon,
} from '@epam/uui';
import { AdaptiveItemProps, Dropdown, MainMenuCustomElement, MainMenuLogo } from '@epam/uui-components';
import { ReactComponent as HelpIcon } from '@epam/assets/icons/common/notification-help-outline-24.svg';
import { ALL_AVATARS } from '../avatarStack/avatarsExamples';

export const renderBurgerExamples = [
    {
        value: () => (
            <>
                <BurgerButton caption="My" href="/" />
                <BurgerButton caption="My Team" href="/" />
                <BurgerButton caption="Skill Matrices" href="/" />
                <BurgerButton caption="Help" href="/" />
                <BurgerButton caption="Settings" href="/" />
                <BurgerButton caption="Log out" href="/" />
            </>
        ),
        name: 'Grow',
        isDefault: true,
    },
];

export const childrenExamples = [
    {
        value: [
            <MainMenuLogo key="appLogo2" logoUrl="/static/images/app-logos/grow_logo.svg" priority={ 100500 } estimatedWidth={ 142 } />,
            <MainMenuButton caption="Me" collapseToMore priority={ 3 } estimatedWidth={ 52 } showInBurgerMenu key="me" isLinkActive={ true } />,
            <MainMenuButton caption="My Team" collapseToMore priority={ 2 } estimatedWidth={ 92 } showInBurgerMenu key="my team" />,
            <MainMenuButton caption="Skill Matrices" collapseToMore priority={ 1 } estimatedWidth={ 139 } showInBurgerMenu key="skill" href="/" />,
            <FlexSpacer priority={ 100500 } key="spacer" />,
            <MainMenuButton caption="Tools" type="secondary" isDropdown priority={ 4 } estimatedWidth={ 113 } key="tool" />,
            <GlobalMenu priority={ 100500 } estimatedWidth={ 60 } key="global-menu" rawProps={ { 'aria-label': 'Global Menu' } } />,
        ],
        name: 'Grow',
        isDefault: true,
    },
    {
        value: [
            <MainMenuLogo key="appLogo2" logoUrl="/static/images/app-logos/learn_logo.svg" priority={ 100500 } estimatedWidth={ 142 } />,
            <MainMenuButton key="start" caption="Start" collapseToMore priority={ 3 } estimatedWidth={ 62 } showInBurgerMenu isLinkActive={ true } />,
            <MainMenuButton key="explore" caption="Explore" collapseToMore priority={ 2 } estimatedWidth={ 78 } showInBurgerMenu />,
            <MainMenuButton key="myLearning" caption="My Learning" collapseToMore priority={ 2 } estimatedWidth={ 104 } showInBurgerMenu href="/" />,
            <FlexSpacer priority={ 100500 } key="spacer" />,
            <MainMenuAvatar
                isDropdown
                key="avatar"
                avatarUrl="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4"
                priority={ 100 }
                estimatedWidth={ 84 }
                rawProps={ { 'aria-label': 'Avatar' } }
            />,
            <GlobalMenu priority={ 100500 } estimatedWidth={ 60 } key="global-menu" rawProps={ { 'aria-label': 'Global Menu' } } />,
        ],
        name: 'Learn',
    },
    {
        value: [
            <MainMenuLogo key="appLogo2" logoUrl="/static/logo.svg" priority={ 100500 } estimatedWidth={ 52 } />,
            <MainMenuButton caption="Home" priority={ 4 } collapseToMore estimatedWidth={ 68 } showInBurgerMenu key="home" isLinkActive={ true } />,
            <MainMenuButton caption="Assets" priority={ 2 } collapseToMore estimatedWidth={ 68 } showInBurgerMenu key="assets" />,
            <MainMenuButton caption="Components" priority={ 4 } collapseToMore estimatedWidth={ 108 } showInBurgerMenu key="components" />,
            <MainMenuButton caption="Demos" priority={ 2 } collapseToMore estimatedWidth={ 72 } showInBurgerMenu key="demos" />,
            <MainMenuButton caption="Tests" priority={ 1 } collapseToMore estimatedWidth={ 62 } showInBurgerMenu key="tests" />,
            <FlexSpacer priority={ 100500 } key="spacer" />,
            <GlobalMenu priority={ 100500 } estimatedWidth={ 60 } key="global-menu" rawProps={ { 'aria-label': 'Global Menu' } } />,
        ],
        name: 'UI',
    },
    {
        value: [
            <MainMenuLogo key="appLogo2" logoUrl="/static/images/app-logos/heroes_logo.svg" priority={ 100500 } estimatedWidth={ 52 } />,
            <MainMenuButton caption="Home" priority={ 4 } collapseToMore estimatedWidth={ 68 } showInBurgerMenu key="home" isLinkActive={ true } />,
            <MainMenuButton caption="Assets" priority={ 2 } collapseToMore estimatedWidth={ 68 } showInBurgerMenu key="assets" />,
            <MainMenuButton caption="Components" priority={ 4 } collapseToMore estimatedWidth={ 108 } showInBurgerMenu key="components" />,
            <MainMenuButton caption="Demos" priority={ 2 } collapseToMore estimatedWidth={ 72 } showInBurgerMenu key="demos" />,
            <MainMenuButton caption="Tests" priority={ 1 } collapseToMore estimatedWidth={ 62 } showInBurgerMenu key="tests" />,
            <FlexSpacer priority={ 100500 } key="spacer" />,
            <MainMenuCustomElement key="badge" estimatedWidth={ 94 } priority={ 12 }>
                <div style={ { alignSelf: 'flex-start' } }>
                    <img
                        style={ {
                            padding: '0 16px',
                            cursor: 'pointer',
                        } }
                        src="/static/images/give_badge.svg"
                        alt="give-badge"
                    />
                </div>
            </MainMenuCustomElement>,
            <GlobalMenu priority={ 100500 } estimatedWidth={ 60 } key="global-menu" rawProps={ { 'aria-label': 'Global Menu' } } />,
        ],
        name: 'Heroes',
    },
];

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
                <MainMenuAvatar avatarUrl="https://api.dicebear.com/7.x/pixel-art/svg?seed=Coco&radius=50&backgroundColor=b6e3f4" isDropdown { ...props } rawProps={ { 'aria-label': 'Avatar' } } />
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
const items: AdaptiveItemProps[] = [
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
    { id: 'help', priority: 1, render: (p) => <MainMenuIcon key={ p.id } href="https://support.epam.com" target="_blank" icon={ HelpIcon } rawProps={ { 'aria-label': 'Help' } } /> },
    { id: 'avatar', priority: 2, render: renderAvatar },
    { id: 'globalMenu', priority: 100, render: (p) => <GlobalMenu key={ p.id } rawProps={ { 'aria-label': 'Global Menu' } } /> },
];
export const itemsExamples = [
    {
        name: `Items: ${items.map((i) => i.id).join(', ')}.`,
        value: items,
    },
    {
        name: 'Learn',
        value: [
            {
                id: 'appLogo2',
                priority: 99,
                render: (p: AdaptiveItemProps) => <MainMenuLogo key={ p.id } logoUrl="/static/images/app-logos/learn_logo.svg" estimatedWidth={ 142 } />,
            },
            {
                id: 'start',
                priority: 3,
                render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Start" collapseToMore estimatedWidth={ 62 } showInBurgerMenu isLinkActive={ true } />,
            },
            {
                id: 'explore',
                priority: 2,
                render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Explore" collapseToMore estimatedWidth={ 78 } showInBurgerMenu />,
            },
            {
                id: 'myLearning',
                priority: 2,
                render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="My Learning" collapseToMore estimatedWidth={ 104 } showInBurgerMenu href="/" />,
            },
            {
                id: 'spacer',
                priority: 3,
                render: (p: AdaptiveItemProps) => <FlexSpacer key={ p.id } />,
            },
            {
                id: 'avatar',
                priority: 100,
                render: (p: AdaptiveItemProps) => (
                    <MainMenuAvatar
                        isDropdown
                        key={ p.id }
                        avatarUrl={ ALL_AVATARS[0] }
                        estimatedWidth={ 84 }
                        rawProps={ { 'aria-label': 'Avatar' } }
                    />
                ),
            },
            {
                id: 'global-menu',
                priority: 100,
                render: (p: AdaptiveItemProps) => <GlobalMenu estimatedWidth={ 60 } key={ p.id } rawProps={ { 'aria-label': 'Global Menu' } } />,
            },
        ],
    },
];

import * as React from 'react';
import { IPropSamplesCreationContext } from '@epam/uui-docs';
import {
    Burger,
    BurgerButton,
    DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter,
    FlexSpacer,
    GlobalMenu,
    MainMenuAvatar,
    MainMenuButton,
    MainMenuDropdown,
    MainMenuIcon,
    MainMenuProps,
} from '@epam/uui';
import { MainMenuProps as LoveshipMainMenuProps } from '@epam/loveship';
import { MainMenuProps as ElectricMainMenuProps } from '@epam/electric';
import { AdaptiveItemProps, Dropdown, MainMenuCustomElement, MainMenuLogo } from '@epam/uui-components';
import { ReactComponent as HelpIcon } from '@epam/assets/icons/common/notification-help-outline-24.svg';
import { ALL_AVATARS } from '../avatarStack/avatarsExamples';

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

export const getItemsExamples = (props: IPropSamplesCreationContext<MainMenuProps | LoveshipMainMenuProps | ElectricMainMenuProps>) => {
    let learn_logo = '/static/images/app-logos/learn_logo.svg';
    let grow_logo = '/static/images/app-logos/grow_logo.svg';
    let heroes_logo = '/static/images/app-logos/heroes_logo.svg';
    let logo = '/static/logo.svg';

    const selectedProps = props.getSelectedProps();

    if ('color' in selectedProps && selectedProps.color === 'white') {
        learn_logo = '/static/images/app-logos/learn_dark_logo.svg';
        grow_logo = '/static/images/app-logos/grow_dark_logo.svg';
        heroes_logo = '/static/images/app-logos/heroes_dark_logo.svg';
        logo = '/static/logo_dark.svg';
    }

    const growItems = [
        {
            id: 'appLogo2',
            priority: 100500,
            estimatedWidth: 142,
            render: (p: AdaptiveItemProps) => <MainMenuLogo key={ p.id } link={ { pathname: '/' } } logoUrl={ grow_logo } priority={ 100500 } estimatedWidth={ 142 } />,
        },
        {
            id: 'me',
            caption: 'Me',
            collapseToMore: true,
            priority: 3,
            estimatedWidth: 52,
            showInBurgerMenu: true,
            isLinkActive: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Me" collapseToMore priority={ 3 } estimatedWidth={ 52 } showInBurgerMenu isLinkActive />,
        },
        {
            id: 'myTeam',
            caption: 'My Team',
            collapseToMore: true,
            priority: 2,
            estimatedWidth: 92,
            showInBurgerMenu: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="My Team" collapseToMore priority={ 2 } estimatedWidth={ 92 } showInBurgerMenu />,
        },
        {
            id: 'skill',
            caption: 'Skill Matrices',
            collapseToMore: true,
            priority: 1,
            estimatedWidth: 139,
            showInBurgerMenu: true,
            href: '/',
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Skill Matrices" collapseToMore priority={ 1 } estimatedWidth={ 139 } showInBurgerMenu href="/" />,
        },
        {
            id: 'spacer',
            priority: 100500,
            render: (p: AdaptiveItemProps) => <FlexSpacer key={ p.id } priority={ 100500 } />,
        },
        {
            id: 'tool',
            caption: 'Tools',
            type: 'secondary',
            isDropdown: true,
            priority: 4,
            estimatedWidth: 113,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Tools" type="secondary" isDropdown priority={ 4 } estimatedWidth={ 113 } />,
        },
        {
            id: 'global-menu',
            priority: 100500,
            estimatedWidth: 60,
            render: (p: AdaptiveItemProps) => <GlobalMenu key={ p.id } priority={ 100500 } estimatedWidth={ 60 } rawProps={ { 'aria-label': 'Global Menu' } } />,
        },
    ];

    const uiItems = [
        {
            id: 'appLogo2',
            priority: 100500,
            estimatedWidth: 52,
            render: (p: AdaptiveItemProps) => <MainMenuLogo key={ p.id } logoUrl={ logo } priority={ 100500 } estimatedWidth={ 52 } />,
        },
        {
            id: 'home',
            caption: 'Home',
            priority: 4,
            collapseToMore: true,
            estimatedWidth: 68,
            showInBurgerMenu: true,
            isLinkActive: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Home" priority={ 4 } collapseToMore estimatedWidth={ 68 } showInBurgerMenu isLinkActive />,
        },
        {
            id: 'assets',
            caption: 'Assets',
            priority: 2,
            collapseToMore: true,
            estimatedWidth: 68,
            showInBurgerMenu: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Assets" priority={ 2 } collapseToMore estimatedWidth={ 68 } showInBurgerMenu />,
        },
        {
            id: 'components',
            caption: 'Components',
            priority: 4,
            collapseToMore: true,
            estimatedWidth: 108,
            showInBurgerMenu: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Components" priority={ 4 } collapseToMore estimatedWidth={ 108 } showInBurgerMenu />,
        },
        {
            id: 'demos',
            caption: 'Demos',
            priority: 2,
            collapseToMore: true,
            estimatedWidth: 72,
            showInBurgerMenu: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Demos" priority={ 2 } collapseToMore estimatedWidth={ 72 } showInBurgerMenu />,
        },
        {
            id: 'tests',
            caption: 'Tests',
            priority: 1,
            collapseToMore: true,
            estimatedWidth: 62,
            showInBurgerMenu: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Tests" priority={ 1 } collapseToMore estimatedWidth={ 62 } showInBurgerMenu />,
        },
        {
            id: 'spacer',
            priority: 100500,
            render: (p: AdaptiveItemProps) => <FlexSpacer key={ p.id } priority={ 100500 } />,
        },
        {
            id: 'global-menu',
            priority: 100500,
            estimatedWidth: 60,
            render: (p: AdaptiveItemProps) => <GlobalMenu key={ p.id } priority={ 100500 } estimatedWidth={ 60 } rawProps={ { 'aria-label': 'Global Menu' } } />,
        },
    ];

    const heroesItems = [
        {
            id: 'appLogo2',
            priority: 100500,
            estimatedWidth: 52,
            render: (p: AdaptiveItemProps) => <MainMenuLogo key={ p.id } logoUrl={ heroes_logo } priority={ 100500 } estimatedWidth={ 52 } />,
        },
        {
            id: 'home',
            caption: 'Home',
            priority: 4,
            collapseToMore: true,
            estimatedWidth: 68,
            showInBurgerMenu: true,
            isLinkActive: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Home" priority={ 4 } collapseToMore estimatedWidth={ 68 } showInBurgerMenu isLinkActive />,
        },
        {
            id: 'assets',
            caption: 'Assets',
            priority: 2,
            collapseToMore: true,
            estimatedWidth: 68,
            showInBurgerMenu: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Assets" priority={ 2 } collapseToMore estimatedWidth={ 68 } showInBurgerMenu />,
        },
        {
            id: 'components',
            caption: 'Components',
            priority: 4,
            collapseToMore: true,
            estimatedWidth: 108,
            showInBurgerMenu: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Components" priority={ 4 } collapseToMore estimatedWidth={ 108 } showInBurgerMenu />,
        },
        {
            id: 'demos',
            caption: 'Demos',
            priority: 2,
            collapseToMore: true,
            estimatedWidth: 72,
            showInBurgerMenu: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Demos" priority={ 2 } collapseToMore estimatedWidth={ 72 } showInBurgerMenu />,
        },
        {
            id: 'tests',
            caption: 'Tests',
            priority: 1,
            collapseToMore: true,
            estimatedWidth: 62,
            showInBurgerMenu: true,
            render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="Tests" priority={ 1 } collapseToMore estimatedWidth={ 62 } showInBurgerMenu />,
        },
        {
            id: 'spacer',
            priority: 100500,
            render: (p: AdaptiveItemProps) => <FlexSpacer key={ p.id } priority={ 100500 } />,
        },
        {
            id: 'badge',
            estimatedWidth: 94,
            priority: 12,
            render: (p: AdaptiveItemProps) => (
                <MainMenuCustomElement key={ p.id } estimatedWidth={ 94 } priority={ 12 }>
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
                </MainMenuCustomElement>
            ),
        },
        {
            id: 'global-menu',
            priority: 100500,
            estimatedWidth: 60,
            render: (p: AdaptiveItemProps) => <GlobalMenu key={ p.id } priority={ 100500 } estimatedWidth={ 60 } rawProps={ { 'aria-label': 'Global Menu' } } />,
        },
    ];

    const items: AdaptiveItemProps[] = [
        {
            id: 'burger', priority: 100, collapsedContainer: true, render: (p) => <Burger key={ p.id } width={ 300 } renderBurgerContent={ renderBurger } />,
        },
        {
            id: 'logo',
            priority: 99,
            render: (p) => <MainMenuLogo key={ p.id } href="https://learn.epam.com/" logoUrl={ learn_logo } />,
        },
        { id: 'trainingCatalog', priority: 3, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Training Catalog" /> },
        { id: 'requests', priority: 3, render: (p) => <MainMenuButton key={ p.id } href="/" caption="Requests" /> },
        { id: 'flexSpacer', priority: 100, render: (p) => <FlexSpacer key={ p.id } /> },
        { id: 'help', priority: 1, render: (p) => <MainMenuIcon key={ p.id } href="https://support.epam.com" target="_blank" icon={ HelpIcon } rawProps={ { 'aria-label': 'Help' } } /> },
        { id: 'avatar', priority: 2, render: renderAvatar },
        { id: 'globalMenu', priority: 100, render: (p) => <GlobalMenu key={ p.id } rawProps={ { 'aria-label': 'Global Menu' } } /> },
    ];

    return [
        {
            name: `Items: ${items.map((i) => i.id).join(', ')}.`,
            value: items,
            isDefault: true,
        },
        {
            name: 'Learn', // this is the default example for E2E tests, do not change them
            value: [
                {
                    id: 'appLogo2',
                    priority: 99,
                    render: (p: AdaptiveItemProps) => <MainMenuLogo key={ p.id } logoUrl={ learn_logo } estimatedWidth={ 142 } />,
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
        {
            name: 'Grow',
            value: growItems,
        },
        {
            name: 'UI',
            value: uiItems,
        },
        {
            name: 'Heroes',
            value: heroesItems,
        },
        {
            name: 'Learn (advanced)',
            value: [
                {
                    id: 'burger', priority: 100, collapsedContainer: true, render: (p: AdaptiveItemProps<any>) => <Burger key={ p.id } width={ 300 } renderBurgerContent={ renderBurger } />,
                },
                {
                    id: 'appLogo2',
                    priority: 99,
                    render: (p: AdaptiveItemProps) => <MainMenuLogo key={ p.id } logoUrl={ learn_logo } estimatedWidth={ 142 } />,
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
                    priority: 1,
                    render: (p: AdaptiveItemProps) => <MainMenuButton key={ p.id } caption="My Learning" collapseToMore estimatedWidth={ 104 } showInBurgerMenu href="/" />,
                },
                {
                    id: 'moreContainer',
                    priority: 7,
                    collapsedContainer: true,
                    render: (item: { id: React.Key; }, hiddenItems: any[]) => {
                        return (
                            <MainMenuDropdown
                                caption="More"
                                key={ item.id }
                                renderBody={ (props) => {
                                    return hiddenItems?.map((i) => {
                                        return i.render({ ...i, onClose: props.onClose });
                                    });
                                } }
                            />
                        );
                    },
                },
                {
                    id: 'spacer',
                    priority: 100,
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
};

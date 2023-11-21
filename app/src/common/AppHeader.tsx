import React from 'react';
import {
    BurgerButton, MainMenu, FlexSpacer, GlobalMenu, MainMenuButton, Text, IconContainer, Burger, DropdownMenuSplitter, MainMenuDropdown,
} from '@epam/promo';
import { Anchor, MainMenuLogo } from '@epam/uui-components';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';
import css from './AppHeader.module.scss';
import { ReactComponent as GitIcon } from '../icons/git-branch-18.svg';
import { useTheme } from '../helpers/useTheme';
import { TSkin } from '@epam/uui-docs';

export type Theme = 'uui-theme-promo' | 'uui-theme-loveship' | 'uui-theme-loveship_dark' | 'uui-theme-electric' | 'uui-theme-vanilla_thunder';
const themeName: Record<Theme, 'Promo' | 'Loveship' | 'Loveship Dark' | 'Electric' | 'Vanilla Thunder'> = {
    'uui-theme-promo': 'Promo',
    'uui-theme-loveship': 'Loveship',
    'uui-theme-loveship_dark': 'Loveship Dark',
    'uui-theme-electric': 'Electric',
    'uui-theme-vanilla_thunder': 'Vanilla Thunder',
} as const;

const GIT_LINK = 'https://github.com/epam/UUI';

export function AppHeader() {
    const { theme, toggleTheme } = useTheme();

    const sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.trusted(link));
    };

    const renderBurger = () => {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;
        return (
            <>
                <BurgerButton caption="Home" link={ { pathname: '/' } } clickAnalyticsEvent={ () => sendEvent('Welcome') } />
                <BurgerButton
                    caption="Documents"
                    link={ { pathname: '/documents', query: { id: 'overview' } } }
                    isLinkActive={ pathName === 'documents' && !category }
                    clickAnalyticsEvent={ () => sendEvent('Documents') }
                />
                <BurgerButton
                    caption="Assets"
                    link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                    isLinkActive={ pathName === '/documents' && category === 'assets' }
                    clickAnalyticsEvent={ () => sendEvent('Assets') }
                />
                <BurgerButton
                    caption="Components"
                    link={ {
                        pathname: '/documents',
                        query: {
                            id: 'accordion', mode: 'doc', skin: TSkin.UUI, category: 'components',
                        },
                    } }
                    isLinkActive={ pathName === '/documents' && category === 'components' }
                    clickAnalyticsEvent={ () => sendEvent('Components') }
                />
                <BurgerButton caption="Demo" link={ { pathname: '/demo' } } isLinkActive={ pathName === '/demo' } clickAnalyticsEvent={ () => sendEvent('Demo') } />
            </>
        );
    };

    const renderThemeSwitcher = () => {
        const bodyItems = [
            <MainMenuButton caption="Promo" isLinkActive={ theme === 'uui-theme-promo' } iconPosition="right" onClick={ () => toggleTheme('uui-theme-promo') } />,
            <MainMenuButton caption="Loveship" isLinkActive={ theme === 'uui-theme-loveship' } iconPosition="right" onClick={ () => toggleTheme('uui-theme-loveship') } />,
            <MainMenuButton caption="Loveship Dark" isLinkActive={ theme === 'uui-theme-loveship_dark' } iconPosition="right" onClick={ () => toggleTheme('uui-theme-loveship_dark') } />,
            <MainMenuButton caption="Electric" isLinkActive={ theme === 'uui-theme-electric' } iconPosition="right" onClick={ () => toggleTheme('uui-theme-electric') } />,
            <DropdownMenuSplitter />,
            <MainMenuButton caption="RD Portal" isLinkActive={ theme === 'uui-theme-vanilla_thunder' } iconPosition="right" onClick={ () => toggleTheme('uui-theme-vanilla_thunder') } />,
        ];

        return (
            <MainMenuDropdown key="theme-switcher" caption={ `Theme: ${themeName[theme as Theme]}` }>
                { bodyItems }
            </MainMenuDropdown>
        );
    };

    const getMainMenuItems = () => {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;

        return [
            {
                id: 'burger',
                priority: 100500,
                collapsedContainer: true,
                render: () => <Burger renderBurgerContent={ renderBurger } logoUrl="/static/logo.svg" key="burger" />,
            },
            {
                id: 'logo',
                priority: 100499,
                render: () => <MainMenuLogo link={ { pathname: '/' } } onClick={ () => sendEvent('Welcome') } logoUrl="/static/logo.svg" key="logo" />,
            },
            {
                id: 'documents',
                priority: 3,
                render: () => (
                    <MainMenuButton
                        caption="Documents"
                        link={ { pathname: '/documents', query: { id: 'overview' } } }
                        isLinkActive={ pathName === '/documents' && category !== 'components' && category !== 'assets' }
                        showInBurgerMenu
                        clickAnalyticsEvent={ analyticsEvents.header.link('Documents') }
                        key="documents"
                    />
                ),
            },
            {
                id: 'assets',
                priority: 2,
                render: () => (
                    <MainMenuButton
                        caption="Assets"
                        link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                        isLinkActive={ pathName === '/documents' && category === 'assets' }
                        showInBurgerMenu
                        clickAnalyticsEvent={ analyticsEvents.header.link('Assets') }
                        key="assets"
                    />
                ),
            },
            {
                id: 'components',
                priority: 2,
                render: () => (
                    <MainMenuButton
                        caption="Components"
                        link={ {
                            pathname: '/documents',
                            query: {
                                id: 'accordion', mode: 'doc', skin: TSkin.UUI, category: 'components',
                            },
                        } }
                        isLinkActive={ pathName === '/documents' && category === 'components' }
                        showInBurgerMenu
                        clickAnalyticsEvent={ analyticsEvents.header.link('Components') }
                        key="components"
                    />
                ),
            },
            {
                id: 'demo',
                priority: 2,
                render: () => (
                    <MainMenuButton
                        caption="Demo"
                        link={ { pathname: '/demo' } }
                        isLinkActive={ pathName === '/demo' }
                        showInBurgerMenu
                        clickAnalyticsEvent={ analyticsEvents.header.link('Demo') }
                        key="demo"
                    />
                ),
            },
            window.location.host.includes('localhost') && {
                id: 'Sandbox',
                priority: 1,
                render: () => <MainMenuButton caption="Sandbox" link={ { pathname: '/sandbox' } } isLinkActive={ pathName === '/sandbox' } key="sandbox" />,
            },
            { id: 'flexSpacer', priority: 100500, render: () => <FlexSpacer priority={ 100500 } key="spacer" /> },
            { id: 'theme', priority: 3, render: renderThemeSwitcher },
            {
                id: 'git',
                priority: 0,
                render: () => (
                    <Anchor cx={ css.linkContainer } href={ GIT_LINK } target="_blank" onClick={ () => sendEvent(GIT_LINK) } key="git">
                        <IconContainer icon={ GitIcon } cx={ css.gitIcon } />
                        <Text font="sans-semibold" fontSize="14" lineHeight="24" cx={ css.linkCaption }>
                            Open Git
                        </Text>
                    </Anchor>
                ),
            },
            { id: 'globalMenu', priority: 100500, render: () => <GlobalMenu key="globalMenu" /> },
        ].filter((i) => !!i);
    };

    return <MainMenu cx={ css.root } items={ getMainMenuItems() }></MainMenu>;
}

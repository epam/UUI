import React, { useState } from 'react';
import {
    BurgerButton, MainMenu, FlexSpacer, GlobalMenu, MainMenuButton, Text, IconContainer, Burger, DropdownMenuSplitter, MainMenuDropdown,
} from '@epam/promo';
import { Anchor, MainMenuLogo } from '@epam/uui-components';
import { UUI4 } from './docs';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';
import css from './AppHeader.module.scss';
import { ReactComponent as GitIcon } from '../icons/git-branch-18.svg';

type Theme = 'promo' | 'loveship' | 'loveship_dark' | 'vanilla_thunder';
const themeName: Record<Theme, 'Promo' | 'Loveship' | 'Loveship Dark' | 'Vanilla Thunder'> = {
    promo: 'Promo',
    loveship: 'Loveship',
    loveship_dark: 'Loveship Dark',
    vanilla_thunder: 'Vanilla Thunder',
};

const GIT_LINK = 'https://github.com/epam/UUI';

export function AppHeader() {
    const [theme, setTheme] = useState<Theme>(document.body.classList.value.match(/uui-theme-(\S+)\s*/)[1] as Theme);

    const sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.trusted(link));
    };

    const updateTheme = (newTheme: Theme) => {
        document.body.classList.remove(`uui-theme-${theme}`);
        document.body.classList.add(`uui-theme-${newTheme}`);
        setTheme(newTheme);
    };

    const renderBurger = () => {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;
        return (
            <>
                <BurgerButton caption="Home" link={ { pathname: '/' } } clickAnalyticsEvent={ () => sendEvent('Welcome') } />
                <BurgerButton
                    caption="Documents"
                    link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
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
                            id: 'accordion', mode: 'doc', skin: UUI4, category: 'components',
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
        const renderBodyItems = () => (
            <>
                <MainMenuButton caption="Promo" isLinkActive={ theme === 'promo' } iconPosition="right" onClick={ () => updateTheme('promo') } />
                <MainMenuButton caption="Loveship" isLinkActive={ theme === 'loveship' } iconPosition="right" onClick={ () => updateTheme('loveship') } />
                <MainMenuButton caption="Loveship Dark" isLinkActive={ theme === 'loveship_dark' } iconPosition="right" onClick={ () => updateTheme('loveship_dark') } />
                <DropdownMenuSplitter />
                <MainMenuButton caption="RD Portal" isLinkActive={ theme === 'vanilla_thunder' } iconPosition="right" onClick={ () => updateTheme('vanilla_thunder') } />
            </>
        );

        return <MainMenuDropdown key="theme-switcher" caption={ `Theme: ${themeName[theme]}` } renderBody={ renderBodyItems } />;
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
                        link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
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
                                id: 'accordion', mode: 'doc', skin: UUI4, category: 'components',
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

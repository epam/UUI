import React, { useState } from 'react';
import cx from 'classnames';
import { isMobile, useDocumentDir } from '@epam/uui-core';
import { Anchor, MainMenuCustomElement } from '@epam/uui-components';
import {
    Burger, BurgerButton, Button, Dropdown, DropdownMenuBody, DropdownMenuButton, FlexSpacer, GlobalMenu, IconContainer,
    MainMenu, MainMenuButton, MultiSwitch, Text, FlexRow, DropdownMenuHeader, MainMenuDropdown, BurgerGroupHeader,
} from '@epam/uui';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';
import { TMode } from './docs/docsConstants';
import { useAppThemeContext } from '../helpers/appTheme';

import { ReactComponent as LogoIcon } from '../icons/logo.svg';
import { ReactComponent as ThemeIcon } from '../icons/color-pallete.svg';
import { ReactComponent as GitIcon } from '@epam/assets/icons/external_logo/github-fill.svg';
import { ReactComponent as FigmaIcon } from '@epam/assets/icons/external_logo/figma-logo-outline-inverted.svg';
import { ReactComponent as DoneIcon } from '@epam/assets/icons/common/notification-done-18.svg';
import { ReactComponent as CommunicationStarOutlineIcon } from '@epam/assets/icons/communication-star-outline.svg';

import css from './AppHeader.module.scss';

const GIT_LINK = 'https://github.com/epam/UUI';

type ContentDirection = 'rtl' | 'ltr';

export function AppHeader() {
    const { theme, toggleTheme, themesById } = useAppThemeContext();
    const dir = useDocumentDir();
    const [direction, setDirection] = useState<ContentDirection>(dir || 'ltr');

    const sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.trusted(link));
    };

    const changeContentDirection = (value: ContentDirection) => {
        setDirection(value);
        window.document.dir = value;
    };

    const renderBurger = () => {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;
        return (
            <>
                <BurgerButton caption="Home" link={ { pathname: '/' } } clickAnalyticsEvent={ () => sendEvent('Welcome') } />
                <BurgerButton
                    caption="Docs"
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
                            category: 'components', id: 'accordion', mode: TMode.doc,
                        },
                    } }
                    isLinkActive={ pathName === '/documents' && category === 'components' }
                    clickAnalyticsEvent={ () => sendEvent('Components') }
                />
                <BurgerButton caption="Demo" link={ { pathname: '/demo' } } isLinkActive={ pathName === '/demo' } clickAnalyticsEvent={ () => sendEvent('Demo') } />
                <BurgerGroupHeader caption="Figma source" />
                <BurgerButton icon={ FigmaIcon } caption="Figma Community" href="https://www.figma.com/community/file/1380452603479283689/epam-uui-v5-7" clickAnalyticsEvent={ () => sendEvent('Figma Community') } target="_blank" />
                <BurgerButton icon={ FigmaIcon } caption="EPAM Team (employee only)" href="https://www.figma.com/design/M5Njgc6SQJ3TPUccp5XHQx/UUI-Components?m=auto&t=qiBDEE9slwMV4paI-6" clickAnalyticsEvent={ () => sendEvent('EPAM Team') } target="_blank" />
                <BurgerGroupHeader caption="Code source" />
                <BurgerButton icon={ GitIcon } caption="Github" href={ GIT_LINK } target="_blank" />
            </>
        );
    };

    const renderThemeSwitcher = () => {
        return (
            <Dropdown
                renderBody={ (props) => (
                    <DropdownMenuBody { ...props } rawProps={ { style: { width: '180px', padding: '6px 0', marginTop: '3px' } } }>
                        { Object.values(themesById).map(({ id, name }) => (
                            <DropdownMenuButton
                                key={ id }
                                caption={ name }
                                icon={ theme === id && DoneIcon }
                                isActive={ theme === id }
                                iconPosition="right"
                                onClick={ () => toggleTheme(id) }
                            />
                        )) }
                    </DropdownMenuBody>
                ) }
                renderTarget={ (props) => (
                    <Button { ...props } cx={ css.themeSwitcherButton } icon={ isMobile(768) && ThemeIcon } caption={ !isMobile(768) && themesById[theme]?.name } fill="none" isDropdown={ true } />
                ) }
                placement="bottom-end"
                key="Theme-switcher"
            />
        );
    };

    const renderDirectionSwitcher = () => {
        return (
            <FlexRow padding="12">
                <MultiSwitch value={ direction } onValueChange={ changeContentDirection } items={ [{ id: 'ltr', caption: 'LTR' }, { id: 'rtl', caption: 'RTL' }] } />
            </FlexRow>
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
                render: () => (
                    <MainMenuCustomElement key="logo">
                        <Anchor link={ { pathname: '/' } } onClick={ () => sendEvent('Welcome') }>
                            <IconContainer icon={ LogoIcon } cx={ cx(css.icon, css.logo) } />
                        </Anchor>
                    </MainMenuCustomElement>
                ),
            },
            {
                id: 'documents',
                priority: 7,
                render: () => (
                    <MainMenuButton
                        caption="Docs"
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
                priority: 0,
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
                priority: 1,
                render: () => (
                    <MainMenuButton
                        caption="Components"
                        link={ {
                            pathname: '/documents',
                            query: {
                                category: 'components', id: 'accordion', mode: 'doc',
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
                priority: 6,
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
                priority: 0,
                render: () => <MainMenuButton caption="Sandbox" link={ { pathname: '/sandbox' } } isLinkActive={ pathName === '/sandbox' } key="sandbox" />,
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
                                    if (!['figma', 'git', 'gitStar', 'direction', 'themeCaption'].includes(i.id)) {
                                        return i.render({ ...i, onClose: props.onClose });
                                    }
                                });
                            } }
                        />
                    );
                },
            },
            { id: 'flexSpacer', priority: 100500, render: () => <FlexSpacer priority={ 100500 } key="spacer" /> },
            {
                id: 'figma',
                priority: 5,
                render: () => (
                    <Dropdown
                        renderTarget={ (props) => <MainMenuButton icon={ FigmaIcon } cx={ cx(css.icon, css.figmaIcon) } { ...props } /> }
                        renderBody={ (props) => (
                            <DropdownMenuBody { ...props }>
                                <DropdownMenuHeader caption="Open in" />
                                <DropdownMenuButton caption="Figma Community" href="https://www.figma.com/community/file/1380452603479283689/epam-uui-v5-7" target="_blank" />
                                <DropdownMenuButton caption="EPAM Team (employee only)" href="https://www.figma.com/design/M5Njgc6SQJ3TPUccp5XHQx/UUI-Components?m=auto&t=qiBDEE9slwMV4paI-6" target="_blank" />
                            </DropdownMenuBody>
                        ) }
                    />
                ),
            },
            {
                id: 'git',
                priority: 4,
                render: () => <MainMenuButton icon={ GitIcon } href={ GIT_LINK } target="_blank" cx={ cx(css.icon) } />,
            },
            {
                id: 'gitStar',
                priority: 0,
                render: () => (
                    <Anchor tabIndex={ -1 } cx={ css.gitStarContainer } href={ GIT_LINK } target="_blank" onClick={ () => sendEvent(GIT_LINK) } key="gitstar">
                        <div className={ css.wrapper }>
                            <IconContainer icon={ CommunicationStarOutlineIcon } />
                            <Text cx={ css.starCaption }>Star on github</Text>
                        </div>
                    </Anchor>
                ),
            },
            {
                id: 'themeCaption',
                priority: 6,
                render: () => (
                    <MainMenuButton
                        cx={ css.themeCaption }
                        caption="Theme"
                        showInBurgerMenu
                        key="themeCaption"
                    />
                ),
            },
            { id: 'theme', priority: 100498, render: renderThemeSwitcher },
            !window.location.host.includes('uui.epam.com') && {
                id: 'direction',
                priority: 1,
                render: renderDirectionSwitcher,
            },
            { id: 'globalMenu', priority: 100500, render: () => <GlobalMenu key="globalMenu" /> },
        ].filter((i) => !!i);
    };

    return <MainMenu cx={ css.root } items={ getMainMenuItems() }></MainMenu>;
}

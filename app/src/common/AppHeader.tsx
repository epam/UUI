import * as React from 'react';
import { BurgerButton, MainMenu, FlexSpacer, GlobalMenu, MainMenuButton, Text, IconContainer, Burger } from '@epam/promo';
import { AdaptiveItemProps, Anchor, MainMenuLogo } from '@epam/uui-components';
import { DropdownBodyProps } from "@epam/uui-core";
import { MainMenuDropdown } from "@epam/uui";
import { UUI4 } from './docs';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';
import css from './AppHeader.scss';
import { ReactComponent as GitIcon } from '../icons/git-branch-18.svg';

type Theme = 'promo' | 'loveship' | 'orange' | 'cyan' | 'violet' | 'red';

const GIT_LINK = 'https://github.com/epam/UUI';

export class AppHeader extends React.Component {
    state: { skin: string, theme: Theme } = {
        skin: 'UUI4',
        theme: 'promo',
    };

    private sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.trusted(link));
    }

    setTheme = (newTheme: Theme) => {
        document.body.classList.remove(`uui-theme-${this.state.theme}`);
        document.body.classList.add(`uui-theme-${newTheme}`);
        this.setState(s => ({ ...s, theme: newTheme }));
    }

    renderBurger = () => {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;
        return (
            <>
                <BurgerButton
                    caption='Home'
                    link={ { pathname: '/' } }
                    clickAnalyticsEvent={ () => this.sendEvent('Welcome') }
                />
                <BurgerButton
                    caption='Documents'
                    link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
                    isLinkActive={ (pathName === 'documents' && !category) }
                    clickAnalyticsEvent={ () => this.sendEvent('Documents') }
                />
                <BurgerButton
                    caption='Assets'
                    link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'assets') }
                    clickAnalyticsEvent={ () => this.sendEvent('Assets') }
                />
                <BurgerButton
                    caption='Components'
                    link={ { pathname: '/documents', query: { id: 'accordion', mode: 'doc', skin: UUI4, category: 'components' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'components') }
                    clickAnalyticsEvent={ () => this.sendEvent('Components') }
                />
                <BurgerButton
                    caption='Demo'
                    link={ { pathname: '/demo' } }
                    isLinkActive={ (pathName === '/demo') }
                    clickAnalyticsEvent={ () => this.sendEvent('Demo') }
                />
            </>
        );
    }

    renderThemeSwitcher = () => {
        const { theme: thisTheme } = this.state;

        const renderBodyItems = (props: DropdownBodyProps) => {
            return (
                <>
                    <MainMenuButton caption="Promo" isLinkActive={ thisTheme === 'promo' } onClick={ () => {
                        this.setTheme('promo');
                        props.onClose();
                    } }/>
                    <MainMenuButton caption="Loveship" isLinkActive={ thisTheme === 'loveship' } onClick={ () => {
                        this.setTheme('loveship');
                        props.onClose();
                    } }/>
                </>
            );
        };

        return <MainMenuDropdown caption={ 'Select Theme' } renderBody={ (props) => renderBodyItems(props) }/>;
    }

    getMainMenuItems(): AdaptiveItemProps[] {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;

        return [
            { id: 'burger', priority: 100500, collapsedContainer: true, render: () => <Burger
                    renderBurgerContent={ this.renderBurger }
                    logoUrl='/static/logo.svg'
                    key='burger'
                />,
            },
            {id: 'logo', priority: 100499, render: () => <MainMenuLogo
                    link={ { pathname: '/' } }
                    onClick={ () => this.sendEvent('Welcome') }
                    logoUrl='/static/logo.svg'
                    key='logo'
                />,
            },
            { id: 'documents', priority: 3, render: () => <MainMenuButton
                    caption="Documents"
                    link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
                    isLinkActive={ (pathName === '/documents' && category !== 'components' && category !== 'assets') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Documents') }
                    key='documents'
                />,
            },
            { id: 'assets', priority: 2, render: () => <MainMenuButton
                    caption="Assets"
                    link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'assets') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Assets') }
                    key='assets'
                />,
            },
            { id: 'components', priority: 2, render: () => <MainMenuButton
                    caption="Components"
                    link={ { pathname: '/documents', query: { id: 'accordion', mode: 'doc', skin: UUI4, category: 'components' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'components') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Components') }
                    key='components'
                />,
            },
            { id: 'demo', priority: 2, render: () => <MainMenuButton
                    caption="Demo"
                    link={ { pathname: '/demo' } }
                    isLinkActive={ pathName === '/demo' }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Demo') }
                    key='demo'
                />,
            },
            window.location.host.includes('localhost') && { id: 'Sandbox', priority: 1, render: () =>
                <MainMenuButton
                    caption="Sandbox"
                    link={ { pathname: '/sandbox' } }
                    isLinkActive={ pathName === '/sandbox' }
                    key='sandbox'
                />,
            },
            { id: 'flexSpacer', priority: 100500, render: () => <FlexSpacer priority={ 100500 } key='spacer' /> },
            window.location.host.includes('localhost') && { id: 'theme', priority: 3, render: this.renderThemeSwitcher },
            { id: 'git', priority: 0, render: () => (
                    <Anchor cx={ css.linkContainer } href={ GIT_LINK } target='_blank' onClick={ () => this.sendEvent(GIT_LINK) } key='git'>
                        <IconContainer icon={ GitIcon } cx={ css.gitIcon } />
                        <Text font='sans-semibold' fontSize='14' lineHeight='24' cx={ css.linkCaption } >Open Git</Text>
                    </Anchor>
                ),
            },
            { id: 'globalMenu', priority: 100500, render: () => <GlobalMenu key='globalMenu'/> },
        ].filter(i => !!i);
    }

    render() {
        return (
            <MainMenu cx={ css.root } items={ this.getMainMenuItems() }></MainMenu>
        );
    }
}

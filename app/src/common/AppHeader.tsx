import * as React from 'react';
import {
    BurgerButton, MainMenu, FlexSpacer, GlobalMenu, MainMenuButton, Text, IconContainer, Burger,
    DropdownMenuBody, DropdownMenuButton,
} from '@epam/promo';
import { AdaptiveItemProps, Anchor, Dropdown, MainMenuLogo } from '@epam/uui-components';
import { ReactComponent as GitIcon } from '../icons/git-branch-18.svg';
import { UUI4 } from './docs';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';
import css from './AppHeader.scss';

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
        return (
            <Dropdown
                renderTarget={ props => (
                    <MainMenuButton
                        isDropdown
                        caption='Choose theme'
                        { ...props }
                    />
                ) }
                renderBody={ props => (
                    <DropdownMenuBody { ...props }>
                        <DropdownMenuButton caption='Promo' isSelected={ thisTheme === 'promo' } iconPosition='right' onClick={ () => this.setTheme('promo') } />
                        <DropdownMenuButton caption='Loveship' isSelected={ thisTheme === 'loveship' } iconPosition='right' onClick={ () => this.setTheme('loveship') } />
                        {/*<DropdownMenuSplitter />*/}
                        {/*<DropdownMenuButton caption='Red (restricted)' isSelected={ thisTheme === 'red' } iconPosition='right' onClick={ () => this.setTheme('red') } />*/}
                        {/*<DropdownMenuButton caption='Orange (restricted)' isSelected={ thisTheme === 'orange' } iconPosition='right' onClick={ () => this.setTheme('orange') } />*/}
                        {/*<DropdownMenuButton caption='Cyan (restricted)' isSelected={ thisTheme === 'cyan' } iconPosition='right' onClick={ () => this.setTheme('cyan') } />*/}
                        {/*<DropdownMenuButton caption='Violet (restricted)' isSelected={ thisTheme === 'violet' } iconPosition='right' onClick={ () => this.setTheme('violet') } />*/}
                    </DropdownMenuBody>
                ) }
                placement="bottom-end"
            />
        );
    }

    getMainMenuItems(): AdaptiveItemProps[] {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;

        return [
            { id: 'burger', priority: 100500, collapsedContainer: true, render: () => <Burger
                    key={ 'burger' }
                    renderBurgerContent={ this.renderBurger }
                    logoUrl='/static/logo.svg'
                />,
            },
            {id: 'logo', priority: 100499, render: () => <MainMenuLogo
                    link={ { pathname: '/' } }
                    onClick={ () => this.sendEvent('Welcome') }
                    logoUrl='/static/logo.svg'
                />,
            },
            { id: 'documents', priority: 3, render: () => <MainMenuButton
                    caption="Documents"
                    link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
                    isLinkActive={ (pathName === '/documents' && category !== 'components' && category !== 'assets') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Documents') }
                />,
            },
            { id: 'assets', priority: 2, render: () => <MainMenuButton
                    caption="Assets"
                    link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'assets') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Assets') }
                />,
            },
            { id: 'components', priority: 2, render: () => <MainMenuButton
                    caption="Components"
                    link={ { pathname: '/documents', query: { id: 'accordion', mode: 'doc', skin: UUI4, category: 'components' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'components') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Components') }
                />,
            },
            { id: 'demo', priority: 2, render: () => <MainMenuButton
                    caption="Demo"
                    link={ { pathname: '/demo' } }
                    isLinkActive={ pathName === '/demo' }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Demo') }
                />,
            },
            window.location.host.includes('localhost') && { id: 'Sandbox', priority: 1, render: () =>
                <MainMenuButton
                    caption="Sandbox"
                    link={ { pathname: '/sandbox' } }
                    isLinkActive={ pathName === '/sandbox' }
                />,
            },
            { id: 'flexSpacer', priority: 100500, render: () => <FlexSpacer priority={ 100500 } /> },
            window.location.host.includes('localhost') && { id: 'theme', priority: 3, render: this.renderThemeSwitcher },
            { id: 'git', priority: 0, render: () => (
                    <Anchor cx={ css.linkContainer } href={ GIT_LINK } target='_blank' onClick={ () => this.sendEvent(GIT_LINK) } >
                        <IconContainer icon={ GitIcon } color='white' />
                        <Text font='sans-semibold' fontSize='14' lineHeight='24' cx={ css.linkCaption } >Open Git</Text>
                    </Anchor>
                ),
            },
            { id: 'globalMenu', priority: 100500, render: () => <GlobalMenu /> },
        ].filter(i => !!i);
    }

    render() {
        return (
            <MainMenu cx={ css.root } items={ this.getMainMenuItems() }></MainMenu>
        );
    }
}

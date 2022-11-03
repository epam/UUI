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
import * as css from './AppHeader.scss';

type Theme = 'promo' | 'loveship' | 'orange' | 'cyan' | 'violet' | 'red';
type Grid = '4px' | '6px';

const GIT_LINK = 'https://github.com/epam/UUI';

export class AppHeader extends React.Component {
    state: { skin: string, theme: Theme, grid: Grid } = {
        skin: 'UUI4',
        theme: 'promo',
        grid: '6px',
    };

    private sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.trusted(link));
    }

    setTheme = (newTheme: Theme, newGrid: Grid) => {
        document.body.classList.remove(`uui-theme-${this.state.theme}`);
        document.body.classList.remove(`size-grid-${this.state.grid}`);
        document.body.classList.add(`uui-theme-${newTheme}`);
        document.body.classList.add(`size-grid-${newGrid}`);
        this.setState(s => ({ ...s, theme: newTheme, grid: newGrid }));
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
        const { theme: thisTheme, grid: thisGrid } = this.state;
        return (
            <Dropdown
                key='theme'
                renderTarget={ props => (
                    <MainMenuButton
                        isDropdown
                        caption='Choose theme'
                        { ...props }
                    />
                ) }
                renderBody={ props => (
                    <DropdownMenuBody { ...props }>
                        <DropdownMenuButton caption='Promo 6px' isSelected={ thisTheme === 'promo' && thisGrid === '6px' } iconPosition='right' onClick={ () => this.setTheme('promo', '6px') } />
                        <DropdownMenuButton caption='Promo 4px' isSelected={ thisTheme === 'promo' && thisGrid === '4px' } iconPosition='right' onClick={ () => this.setTheme('promo', '4px') } />
                        <DropdownMenuButton caption='Loveship 6px' isSelected={ thisTheme === 'loveship' && thisGrid === '6px' } iconPosition='right' onClick={ () => this.setTheme('loveship', '6px') } />
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
                    key='logo'
                    link={ { pathname: '/' } }
                    onClick={ () => this.sendEvent('Welcome') }
                    logoUrl='/static/logo.svg'
                />,
            },
            { id: 'documents', priority: 3, render: () => <MainMenuButton
                    key='documents'
                    caption="Documents"
                    link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
                    isLinkActive={ (pathName === '/documents' && category !== 'components' && category !== 'assets') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Documents') }
                />,
            },
            { id: 'assets', priority: 2, render: () => <MainMenuButton
                    key='assets'
                    caption="Assets"
                    link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'assets') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Assets') }
                />,
            },
            { id: 'components', priority: 2, render: () => <MainMenuButton
                    key='components'
                    caption="Components"
                    link={ { pathname: '/documents', query: { id: 'accordion', mode: 'doc', skin: UUI4, category: 'components' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'components') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Components') }
                />,
            },
            { id: 'demo', priority: 2, render: () => <MainMenuButton
                    key='demo'
                    caption="Demo"
                    link={ { pathname: '/demo' } }
                    isLinkActive={ pathName === '/demo' }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Demo') }
                />,
            },
            window.location.host.includes('localhost') && { id: 'sandbox', priority: 1, render: () =>
                <MainMenuButton
                    key='sandbox'
                    caption="Sandbox"
                    link={ { pathname: '/sandbox' } }
                    isLinkActive={ pathName === '/sandbox' }
                />,
            },
            { id: 'flexSpacer', priority: 100500, render: () => <FlexSpacer key='flexSpacer' priority={ 100500 } /> },
            { id: 'theme', priority: 3, render: this.renderThemeSwitcher },
            { id: 'git', priority: 0, render: () => (
                    <Anchor key='git' cx={ css.linkContainer } href={ GIT_LINK } target='_blank' onClick={ () => this.sendEvent(GIT_LINK) } >
                        <IconContainer icon={ GitIcon } color='white' />
                        <Text font='sans-semibold' fontSize='14' lineHeight='24' cx={ css.linkCaption } >Open Git</Text>
                    </Anchor>
                ),
            },
            { id: 'globalMenu', priority: 100500, render: () => <GlobalMenu key='globalMenu' /> },
        ].filter(i => !!i);
    }

    render() {
        return (
            <MainMenu cx={ css.root } items={ this.getMainMenuItems() }></MainMenu>
        );
    }
}
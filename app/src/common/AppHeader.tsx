import * as React from 'react';
import { BurgerButton, MainMenu, FlexSpacer, GlobalMenu, MainMenuButton, Text, IconContainer } from '@epam/promo';
import { Anchor, MainMenuCustomElement } from '@epam/uui-components';
import * as css from './AppHeader.scss';
import * as gitIcon from '../icons/git-branch-18.svg';
import { UUI4 } from './docs';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';

const GIT_LINK = 'https://git.epam.com/epm-tmc/ui/-/tree/master';

export class AppHeader extends React.Component {
    state = {
        skin: 'UUI4',
    };

    private sendEvent = (link: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.trusted(link));
    }

    renderBurger = () => {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;
        return (
            <>
                <BurgerButton 
                    caption='Home' 
                    link={ { pathname: '/' } } 
                />
                <BurgerButton
                    caption='Documents'
                    link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
                    isLinkActive={ (pathName === 'documents' && !category) }
                />
                <BurgerButton
                    caption='Assets'
                    link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'assets') }
                />
                <BurgerButton
                    caption='Components'
                    link={ { pathname: '/documents', query: { id: 'accordion', mode: 'doc', skin: UUI4, category: 'components' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'components') }
                />
                <BurgerButton 
                    caption='Demo' 
                    link={ { pathname: '/demo' } }
                    isLinkActive={ (pathName === '/demo') }
                />
            </>
        );
    }

    render() {
        const category = svc.uuiRouter.getCurrentLink().query.category;
        const pathName = svc.uuiRouter.getCurrentLink().pathname;
        return (
            <MainMenu cx={ css.root } renderBurger={ this.renderBurger } logoLink={ { pathname: '/' } }  appLogoUrl='/static/logo.svg' logoWidth={ 168 } >
                <MainMenuButton
                    caption="Documents"
                    priority={ 3 }
                    estimatedWidth={ 115 }
                    link={ { pathname: '/documents', query: { id: 'gettingStarted' } } }
                    isLinkActive={ (pathName === '/documents' && category !== 'components' && category !== 'assets') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Documents') }
                />
                <MainMenuButton
                    caption="Assets"
                    priority={ 2 }
                    estimatedWidth={ 80 }
                    link={ { pathname: '/documents', query: { id: 'icons', category: 'assets' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'assets') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Assets') }
                />
                <MainMenuButton
                    caption="Components"
                    priority={ 2 }
                    estimatedWidth={ 124 }
                    link={ { pathname: '/documents', query: { id: 'accordion', mode: 'doc', skin: UUI4, category: 'components' } } }
                    isLinkActive={ (pathName === '/documents' && category === 'components') }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Components') }
                />
                <MainMenuButton
                    caption="Demo"
                    priority={ 2 }
                    estimatedWidth={ 77 }
                    link={ { pathname: '/demo' } }
                    isLinkActive={ pathName === '/demo' }
                    showInBurgerMenu
                    clickAnalyticsEvent={ analyticsEvents.header.link('Demo') }
                />
                {
                    window.location.host.includes('localhost') &&
                    <MainMenuButton
                        caption="Sandbox"
                        priority={ 1 }
                        estimatedWidth={ 97 }
                        link={ { pathname: '/sandbox' } }
                        isLinkActive={ pathName === '/sandbox' }
                    />
                }
                <FlexSpacer priority={ 100500 } />
                <MainMenuCustomElement priority={ 0 } estimatedWidth={ 113 }  >
                    <Anchor cx={ css.linkContainer } href={ GIT_LINK } target='_blank' onClick={ () => this.sendEvent(GIT_LINK) } >
                        <IconContainer icon={ gitIcon } color='white' />
                        <Text font='sans-semibold' fontSize='14' lineHeight='24' cx={ css.linkCaption } >Open Git</Text>
                    </Anchor>
                </MainMenuCustomElement>
                <GlobalMenu estimatedWidth={ 60 } priority={ 100500 } />
            </MainMenu>
        );
    }
}
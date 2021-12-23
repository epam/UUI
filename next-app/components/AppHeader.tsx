import * as React from 'react';
import { MainMenu, FlexSpacer, GlobalMenu, Text, IconContainer } from '@epam/promo';
import { MainMenuCustomElement } from '@epam/uui-components';
import css from './AppHeader.module.scss';
import GitIcon from '@epam/assets/icons/common/social-network-github-18.svg';

const GIT_LINK = 'https://github.com/epam/UUI';

export const AppHeader = () => {

    return (
        <MainMenu
            cx={ css.root }
            logoLink={ { pathname: `/` } }
            onLogoClick={ () => null }
            appLogoUrl={ '/icons/logo.svg' }
            logoWidth={ 168 }
        >
            <FlexSpacer priority={ 100500 } />
            <MainMenuCustomElement priority={ 0 } estimatedWidth={ 113 }  >
                <a className={ css.linkContainer } href={ GIT_LINK }>
                    <IconContainer icon={ GitIcon } color='white' />
                    <Text font='sans-semibold' fontSize='14' lineHeight='24' cx={ css.linkCaption } >Open Git</Text>
                </a>
            </MainMenuCustomElement>
            <GlobalMenu estimatedWidth={ 60 } priority={ 100500 } />
        </MainMenu>
    );
}
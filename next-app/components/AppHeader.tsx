import * as React from 'react';
import {
    MainMenu, FlexSpacer, GlobalMenu, Text, IconContainer, Dropdown, MainMenuButton, DropdownMenuBody,
    DropdownMenuButton, BurgerButton, SuccessNotification,
} from '@epam/promo';
import { MainMenuCustomElement } from '@epam/uui-components';
import css from './AppHeader.module.scss';
import GitIcon from '@epam/assets/icons/common/social-network-github-18.svg';
import { useCallback, useContext } from "react";
import { INotification, UuiContext } from "@epam/uui-core";
import { BasicModalExample } from "./Modal";

type Theme = 'promo' | 'loveship_dark';

const GIT_LINK = 'https://github.com/epam/UUI';

export const AppHeader = () => {
    const [theme, setTheme] = React.useState<Theme>('promo');
    const { uuiModals, uuiNotifications } = useContext(UuiContext);

    const handleTheme = (newTheme: Theme) => {
        document.body.classList.remove(`uui-theme-${theme}`);
        document.body.classList.add(`uui-theme-${newTheme}`);
        setTheme(newTheme);
    };

    const renderThemeSwitcher = (): React.ReactNode => {
        return (
            <MainMenuCustomElement priority={ 10 } estimatedWidth={ 84 }>
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
                            <DropdownMenuButton caption='Promo' isSelected={ theme === 'promo' } iconPosition='right' onClick={ () => handleTheme('promo') } />
                            <DropdownMenuButton caption='Loveship dark' isSelected={ theme === 'loveship_dark' } iconPosition='right' onClick={ () => handleTheme('loveship_dark') } />
                        </DropdownMenuBody>
                    ) }
                    placement="bottom-end"
                />
            </MainMenuCustomElement>
        );
    };

    const handleShowModal = useCallback(() => {
        uuiModals
            .show((props) => <BasicModalExample { ...props } />)
            .finally(() => {
                uuiNotifications
                    .show(
                        (props: INotification) => (
                            <SuccessNotification { ...props }>
                                <Text size="36" fontSize="14">
                                    It`s Ok!
                                </Text>
                            </SuccessNotification>
                        ),
                        { duration: 2, position: 'bot-left' },
                    )
                    .catch(() => null);
            });
    }, [uuiModals, uuiNotifications]);

    const handleRenderBurger = useCallback(() => {
        return (
            <BurgerButton caption="Show modal dialog" onClick={ handleShowModal } />
        );
    }, [handleShowModal]);


    return (
        <MainMenu
            cx={ css.root }
            logoLink={ { pathname: `/` } }
            onLogoClick={ () => null }
            appLogoUrl={ '/icons/logo.svg' }
            renderBurger={ handleRenderBurger }
        >
            <FlexSpacer priority={ 100500 } />
            { renderThemeSwitcher() }
            <MainMenuCustomElement priority={ 0 } estimatedWidth={ 113 }  >
                <a className={ css.linkContainer } href={ GIT_LINK }>
                    <IconContainer icon={ GitIcon } />
                    <Text fontWeight="400" fontSize='14' lineHeight='24' cx={ css.linkCaption } >Open Git</Text>
                </a>
            </MainMenuCustomElement>
            <GlobalMenu estimatedWidth={ 60 } priority={ 100500 } />
        </MainMenu>
    );
};

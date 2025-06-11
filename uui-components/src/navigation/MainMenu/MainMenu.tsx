import React, { useCallback, useMemo, MouseEvent } from 'react';
import {
    IAdaptiveItem,
    ICanRedirect,
    IHasCaption,
    IHasChildren,
    IHasCX,
    Link,
    IHasRawProps,
    cx,
    IHasForwardedRef,
    DropdownBodyProps,
} from '@epam/uui-core';
import { BurgerProps } from './Burger/Burger';
import { MainMenuLogo } from '../MainMenu/MainMenuLogo';
import { AdaptivePanel, AdaptiveItemProps } from '../../layout';
import css from './MainMenu.module.scss';

export interface MainMenuDropdownProps
    extends IHasChildren,
    IHasCaption,
    IAdaptiveItem,
    ICanRedirect,
    IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLElement>> {
    /** Render callback for the MainMenuDropdown body.
     * If omitted, component children will be rendered.
     */
    renderBody?: (props: DropdownBodyProps) => React.ReactNode;
}

export interface MainMenuProps
    extends IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    IHasForwardedRef<HTMLDivElement> {
    /** Array of menu items to be rendered */
    items?: AdaptiveItemProps[];
    /** Path to the logo source */
    appLogoUrl?: string;
    /** SPA link to navigate on logo click */
    logoLink?: Link;
    /** Href to navigate on logo click */
    logoHref?: string;
    /** Called when logo is clicked */
    onLogoClick?: (e: MouseEvent) => any;
    /** Path to the customer logo source */
    customerLogoUrl?: string;
    /** SPA link to navigate on customer logo click */
    customerLogoLink?: Link;
    /** Href to navigate on customer logo click */
    customerLogoHref?: string;
    customerLogoBgColor?: string;
    isTransparent?: boolean;
    /** Render callback for burger menu content.
     * Burger will appear, which some items don't fit the menu width.
     * */
    renderBurger?: (props: { onClose: () => void }) => React.ReactNode;
    /** If true, Burger button will be always visible */
    alwaysShowBurger?: boolean;
    serverBadge?: string;
    /** Internal prop to define component for MainMenuDropdown */
    MainMenuDropdown?: React.ComponentType<MainMenuDropdownProps>;
    /** Internal prop to define component for Burger */
    Burger?: React.ComponentType<BurgerProps>;
}

export const uuiMainMenu = {
    container: 'uui-mainmenu-container',
    serverBadge: 'uui-mainmenu-server-badge',
    serverBadgeLabel: 'uui-mainmenu-server-badge-label',
    transparent: 'uui-mainmenu-transparent',
} as const;

export function MainMenu(props: MainMenuProps) {
    const {
        items,
        appLogoUrl,
        logoLink,
        logoHref,
        onLogoClick,
        customerLogoUrl,
        customerLogoLink,
        customerLogoHref,
        customerLogoBgColor,
        isTransparent,
        renderBurger,
        alwaysShowBurger,
        serverBadge,
        Burger,
        cx: cxProp,
        rawProps,
        forwardedRef,
    } = props;

    // Server badge rendering logic
    const renderServerBadge = useCallback(() => {
        if (!serverBadge) return null;
        let serverBadgeColor;
        switch (serverBadge) {
            case 'Dev':
                serverBadgeColor = '#39b7ac';
                break;
            case 'QA':
                serverBadgeColor = '#a3c644';
                break;
            case 'UAT':
                serverBadgeColor = '#937ebd';
                break;
            default:
                serverBadgeColor = '#30b6dd';
        }
        return serverBadge !== 'Prod'
            && serverBadge !== 'Public'
            && serverBadge !== 'Demo' ? (
                <div className={ cx(uuiMainMenu.serverBadge) }>
                    <div
                        className={ cx(uuiMainMenu.serverBadgeLabel) }
                        style={ { background: serverBadgeColor } }
                    >
                        {serverBadge}
                    </div>
                </div>
            ) : null;
    }, [serverBadge]);

    const getMenuItems = useCallback((): AdaptiveItemProps[] => {
        let menuItems: AdaptiveItemProps[] = [];
        if (items) {
            menuItems = items;
        }
        if (appLogoUrl) {
            menuItems.unshift({
                id: 'appLogo',
                priority: 100500,
                render: () => (
                    <MainMenuLogo
                        key="logo"
                        logoUrl={ appLogoUrl }
                        link={ logoLink }
                        href={ logoHref }
                        onClick={ onLogoClick }
                    />
                ),
            });
        }
        if (customerLogoUrl) {
            menuItems.unshift({
                id: 'customerLogo',
                priority: 100499,
                render: () => (
                    <MainMenuLogo
                        key="customerLogo"
                        logoUrl={ customerLogoUrl }
                        logoBgColor={ customerLogoBgColor }
                        link={ customerLogoLink || logoLink }
                        href={ customerLogoHref || logoHref }
                        showArrow
                    />
                ),
            });
        }
        menuItems.unshift({
            id: 'Burger',
            priority: 100501,
            collapsedContainer: !alwaysShowBurger,
            render: () =>
                Burger ? (
                    <Burger
                        key="burger"
                        width={ 300 }
                        renderBurgerContent={ renderBurger }
                        logoUrl={ customerLogoUrl || appLogoUrl }
                        bg={ customerLogoBgColor || undefined }
                    />
                ) : null,
        });
        return menuItems;
    }, [
        items,
        appLogoUrl,
        logoLink,
        logoHref,
        onLogoClick,
        customerLogoUrl,
        customerLogoLink,
        customerLogoHref,
        customerLogoBgColor,
        alwaysShowBurger,
        renderBurger,
        Burger,
    ]);

    const menuItems = useMemo(
        () => items || getMenuItems(),
        [items, getMenuItems],
    );

    return (
        <nav
            key="uuiMainMenu"
            className={ cx(
                cxProp,
                uuiMainMenu.container,
                css.container,
                isTransparent && uuiMainMenu.transparent,
            ) }
            ref={ forwardedRef }
            { ...rawProps }
        >
            <AdaptivePanel items={ menuItems } cx={ css.itemsContainer } />
            {renderServerBadge()}
        </nav>
    );
}

// TODO: Обновить тесты и интеграции, убрать использование children, проверить все обёртки и edge-cases

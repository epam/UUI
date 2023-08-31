import React, { MouseEvent } from 'react';
import {
    IAdaptiveItem, ICanRedirect, IHasCaption, IHasChildren, IHasCX, Link, IHasRawProps, cx, IHasForwardedRef, DropdownBodyProps,
} from '@epam/uui-core';
import { BurgerProps } from './Burger/Burger';
import { MainMenuLogo } from '../MainMenu/MainMenuLogo';
import { AdaptivePanel, AdaptiveItemProps } from '../../layout';
import { i18n } from '../../i18n';
import css from './MainMenu.module.scss';

export interface MainMenuDropdownProps extends IHasChildren, IHasCaption, IAdaptiveItem, ICanRedirect, IHasCX, IHasRawProps<React.HTMLAttributes<HTMLElement>> {
    renderBody?: (props: DropdownBodyProps) => React.ReactNode;
}

export interface MainMenuProps extends IHasCX, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLDivElement> {
    items?: AdaptiveItemProps[];
    children?: any;
    externalGap?: number;
    appLogoUrl?: string;
    appLogoBgColor?: string;
    customerLogoUrl?: string;
    customerLogoBgColor?: string;
    customerLogoWidth?: number;
    isTransparent?: boolean;
    renderBurger?: (props: { onClose: () => void }) => React.ReactNode;
    alwaysShowBurger?: boolean;
    serverBadge?: string;
    tooltipTechInfo?: React.ReactNode;
    logoLink?: Link;
    logoHref?: string;
    logoWidth?: number;
    onLogoClick?: (e: MouseEvent) => any;
    customerLogoLink?: Link;
    customerLogoHref?: string;
    MainMenuDropdown?: React.ComponentType<MainMenuDropdownProps>;
    Burger?: React.ComponentType<BurgerProps>;
}

interface MainMenuState {
    isSidebarOpened?: boolean;
}

export const uuiMainMenu = {
    container: 'uui-mainmenu-container',
    serverBadge: 'uui-mainmenu-server-badge',
    serverBadgeLabel: 'uui-mainmenu-server-badge-label',
    transparent: 'uui-mainmenu-transparent',
} as const;

export class MainMenu extends React.Component<MainMenuProps, MainMenuState> {
    constructor(props: MainMenuProps) {
        super(props);

        this.state = {
            isSidebarOpened: false,
        };
    }

    convertReactChildrenToItems(children: any): AdaptiveItemProps<{ props?: any }>[] {
        const MainMenuDropdown = this.props.MainMenuDropdown;
        let lastItemsIndexWithCollapseToMore;
        let maxCollapseToMorePriority = 0;
        const items: AdaptiveItemProps<{ props?: any }>[] = React.Children.map(children, (child, index) => {
            if (child) {
                const priority = child.props.priority || index;
                if (child.props.collapseToMore) {
                    lastItemsIndexWithCollapseToMore = index;
                    if (priority > maxCollapseToMorePriority) {
                        maxCollapseToMorePriority = priority;
                    }
                }
                return {
                    id: index,
                    priority: priority,
                    render: (item, hiddenItems) => {
                        if (child.props.collapsedContainer) {
                            return React.cloneElement(child, { children: hiddenItems?.map((i) => i.render(item, hiddenItems)) });
                        }
                        return child;
                    },
                    collapsedContainer: child.props.collapsedContainer,
                    props: child.props,
                };
            }
        });

        if (lastItemsIndexWithCollapseToMore) {
            items.splice(lastItemsIndexWithCollapseToMore, 0, {
                id: 'moreButton',
                priority: maxCollapseToMorePriority,
                render: (item, hiddenItems) => (
                    <MainMenuDropdown
                        key="moreDropdown"
                        caption={ i18n.mainMenu.moreButtonCaption }
                        children={ hiddenItems?.filter((i) => i.props.collapseToMore).map((i) => i.render(item, hiddenItems)) }
                    />
                ),
                collapsedContainer: true,
            });
        }

        return items;
    }

    renderServerBadge() {
        let serverBadgeColor;
        if (!this.props.serverBadge) {
            return;
        } else {
            switch (this.props.serverBadge) {
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
        }

        return this.props.serverBadge !== 'Prod' && this.props.serverBadge !== 'Public' && this.props.serverBadge !== 'Demo' ? (
            <div className={ cx(uuiMainMenu.serverBadge) }>
                <div className={ cx(uuiMainMenu.serverBadgeLabel) } style={ { background: serverBadgeColor } }>
                    {this.props.serverBadge}
                </div>
            </div>
        ) : null;
    }

    getMenuItems(): AdaptiveItemProps[] {
        const Burger = this.props.Burger;

        const items: AdaptiveItemProps[] = this.convertReactChildrenToItems(this.props.children);

        if (this.props.appLogoUrl) {
            items.unshift({
                id: 'appLogo',
                priority: 100500,
                render: () => (
                    <MainMenuLogo key="logo" logoUrl={ this.props.appLogoUrl } link={ this.props.logoLink } href={ this.props.logoHref } onClick={ this.props.onLogoClick } />
                ),
            });
        }

        if (this.props.customerLogoUrl) {
            items.unshift({
                id: 'customerLogo',
                priority: 100499,
                render: () => (
                    <MainMenuLogo
                        logoUrl={ this.props.customerLogoUrl }
                        logoBgColor={ this.props.customerLogoBgColor }
                        link={ this.props.customerLogoLink || this.props.logoLink }
                        href={ this.props.customerLogoHref || this.props.logoHref }
                        showArrow
                    />
                ),
            });
        }

        items.unshift({
            id: 'Burger',
            priority: 100501,
            collapsedContainer: !this.props.alwaysShowBurger,
            render: () => (
                <Burger
                    key="burger"
                    width={ 300 }
                    renderBurgerContent={ this.props.renderBurger }
                    logoUrl={ this.props.customerLogoUrl || this.props.appLogoUrl }
                    bg={ this.props.customerLogoBgColor || undefined }
                />
            ),
        });

        return items;
    }

    render() {
        return (
            <nav
                key="uuiMainMenu"
                className={ cx(this.props.cx, uuiMainMenu.container, css.container, this.props.isTransparent && uuiMainMenu.transparent) }
                { ...this.props.rawProps }
            >
                <AdaptivePanel items={ this.props.items || this.getMenuItems() } cx={ css.itemsContainer } />
                {this.renderServerBadge()}
            </nav>
        );
    }
}

import React, { useCallback } from 'react';
import {
    IAdaptiveItem,
    ICanRedirect,
    IHasCaption,
    IHasCX,
    IHasRawProps,
    cx,
    IHasForwardedRef,
    DropdownBodyProps,
} from '@epam/uui-core';
import { AdaptivePanel, AdaptiveItemProps } from '../../layout';
import css from './MainMenu.module.scss';

export interface MainMenuDropdownProps
    extends IHasCaption,
    IAdaptiveItem,
    ICanRedirect,
    IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLElement>> {
    /**
     * Render callback for the MainMenuDropdown body.
     */
    renderBody: (props: DropdownBodyProps) => React.ReactNode;
}

export interface MainMenuProps
    extends IHasCX,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    IHasForwardedRef<HTMLDivElement> {
    /** Array of menu items to be rendered */
    items: AdaptiveItemProps[];
    serverBadge?: string;
}

export const uuiMainMenu = {
    container: 'uui-mainmenu-container',
    serverBadge: 'uui-mainmenu-server-badge',
    serverBadgeLabel: 'uui-mainmenu-server-badge-label',
} as const;

export function MainMenu(props: MainMenuProps) {
    const {
        items,
        serverBadge,
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

    return (
        <nav
            key="uuiMainMenu"
            className={ cx(
                cxProp,
                uuiMainMenu.container,
                css.container,
            ) }
            ref={ forwardedRef }
            { ...rawProps }
        >
            <AdaptivePanel items={ items } cx={ css.itemsContainer } />
            {renderServerBadge()}
        </nav>
    );
}

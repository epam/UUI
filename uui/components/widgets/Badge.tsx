import React from 'react';
import {
    Icon, IDropdownToggler, IHasCaption, IHasIcon, Overwrite, uuiElement,
} from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import { CountIndicator } from './CountIndicator';

import { settings } from '../../settings';
import css from './Badge.module.scss';

const DEFAULT_FILL = 'solid';

type BadgeMods = {
    /** Defines component color. */
    color?: 'info' | 'success' | 'warning' | 'critical' | 'neutral';
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: 'solid' | 'outline';
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '18' | '24' | '30' | '36' | '42' | '48';
};

export interface BadgeModsOverride {}

export interface BadgeCoreProps extends ClickableComponentProps, IDropdownToggler, IHasIcon, IHasCaption {
    /** Pass true to display an indicator. It shows only if fill = 'outline'. */
    indicator?: boolean;
    /**
     * Position of the icon (left of right)
     * @default 'left'
     */
    iconPosition?: 'left' | 'right';
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /** Count value to be placed in component */
    count?: React.ReactNode;
}

/** Represents the properties of a Badge component. */
export interface BadgeProps extends BadgeCoreProps, Overwrite<BadgeMods, BadgeModsOverride>,
    React.RefAttributes<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement> {}

function applyBadgeMods(mods: BadgeProps) {
    return [
        'uui-badge',
        css.root,
        `uui-size-${mods.size || settings.badge.sizes.default}`,
        `uui-fill-${mods.fill || DEFAULT_FILL}`,
        `uui-color-${mods.color || 'info'}`,
    ];
}

export const Badge = (props: BadgeProps) => {
    const styles = [applyBadgeMods(props), props.cx];

    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : settings.badge.icons.dropdownIcon;

    return (
        <Clickable
            { ...props }
            rawProps={ {
                'aria-haspopup': props.isDropdown,
                'aria-expanded': props.isOpen,
                ...props.rawProps,
            } }
            cx={ styles }
            ref={ props.ref }
        >
            {(props.indicator && props.fill === 'outline') && (
                <div className="uui-indicator"></div>
            )}
            { props.icon && props.iconPosition !== 'right' && (
                <IconContainer
                    icon={ props.icon }
                    onClick={ !props.isDisabled ? props.onIconClick : undefined }
                />
            ) }
            { props.caption && (
                <div className={ uuiElement.caption }>
                    { props.caption }
                </div>
            ) }
            { props.count !== undefined && props.count !== null && (
                <CountIndicator
                    key="count-indicator"
                    color={ null }
                    size={ settings.badge.sizes.countIndicatorMap[props.size || settings.badge.sizes.default] }
                    caption={ props.count }
                />
            ) }
            { props.icon && props.iconPosition === 'right' && (
                <IconContainer icon={ props.icon } onClick={ !props.isDisabled ? props.onIconClick : undefined } />
            ) }
            { props.isDropdown && (
                <IconContainer icon={ DropdownIcon } flipY={ props.isOpen } />
            )}
        </Clickable>
    );
};

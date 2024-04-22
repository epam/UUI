import React from 'react';
import {
    CX, cx, devLogger, Icon, IDropdownToggler, IHasCaption, IHasIcon, Overwrite, uuiElement,
} from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import { CountIndicator } from './CountIndicator';
import { systemIcons } from '../../icons/icons';
import css from './Badge.module.scss';

const DEFAULT_SIZE = '36';
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

export type BadgeCoreProps = ClickableComponentProps & IDropdownToggler & IHasIcon & IHasCaption & {
    /** Pass true to display an indicator. It shows only if fill = 'outline'. */
    indicator?: boolean;
    /**
     * Position of the icon (left of right)
     * @default 'left'
     */
    iconPosition?: 'left' | 'right';
    /**
     * CSS classes to put on the caption
     * @deprecated
     * */
    captionCX?: CX;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /** Count value to be placed in component */
    count?: React.ReactNode;
};

/** Represents the properties of a Badge component. */
export type BadgeProps = BadgeCoreProps & Overwrite<BadgeMods, BadgeModsOverride>;

function applyBadgeMods(mods: BadgeProps) {
    return [
        'uui-badge',
        css.root,
        css['size-' + (mods.size || DEFAULT_SIZE)],
        `uui-fill-${mods.fill || DEFAULT_FILL}`,
        `uui-color-${mods.color || 'info'}`,
        mods.indicator && mods.fill === 'outline' && 'uui-indicator',
    ];
}

const mapCountIndicatorSizes = {
    12: '12',
    18: '12',
    24: '18',
    30: '18',
    36: '18',
    42: '24',
    48: '24',
} as const;

export const Badge = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, BadgeProps>((props, ref) => {
    if (__DEV__) {
        devLogger.warnAboutDeprecatedPropValue<BadgeProps, 'size'>({
            component: 'Badge',
            propName: 'size',
            propValue: props.size,
            propValueUseInstead: '42',
            condition: () => ['48'].indexOf(props.size) !== -1,
        });
    }

    if (__DEV__ && props.captionCX) {
        devLogger.warn('Badge: Property \'captionCX\' is deprecated and will be removed in the future release. Please use \'cx\' prop to access caption styles and use cascading to change the styles for the \'uui-caption\' global class');
    }

    const styles = [applyBadgeMods(props), props.cx];

    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : systemIcons.foldingArrow;

    return (
        <Clickable
            { ...props }
            rawProps={ {
                'aria-haspopup': props.isDropdown,
                'aria-expanded': props.isOpen,
                ...props.rawProps,
            } }
            cx={ styles }
            ref={ ref }
        >
            { props.icon && props.iconPosition !== 'right' && (
                <IconContainer
                    icon={ props.icon }
                    onClick={ !props.isDisabled ? props.onIconClick : undefined }
                />
            ) }
            { props.caption && (
                <div className={ cx(uuiElement.caption, props.captionCX) }>
                    { props.caption }
                </div>
            ) }
            { props.count !== undefined && props.count !== null && (
                <CountIndicator
                    key="count-indicator"
                    color={ null }
                    size={ mapCountIndicatorSizes[props.size || DEFAULT_SIZE] }
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
});

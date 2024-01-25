import * as React from 'react';
import { CX, cx, devLogger, IAnalyticableClick, ICanRedirect, IClickable, Icon, IDisableable, IDropdownToggler,
    IHasCaption, IHasCX, IHasIcon, IHasTabIndex, uuiElement, IHasRawProps,
} from '@epam/uui-core';
import {
    AnchorNavigationProps, ButtonNavigationProps, Clickable, HrefNavigationProps, IconContainer, LinkButtonNavigationProps,
} from '@epam/uui-components';
import * as types from '../types';
import { systemIcons } from '../../icons/icons';
import { getIconClass } from './helper';
import css from './LinkButton.module.scss';

const DEFAULT_SIZE = '36';
const DEFAULT_COLOR = 'primary';

interface LinkButtonMods {
    /**
     * Defines component color.
     * @default 'primary'
     */
    color?: 'primary' | 'secondary' | 'contrast';
}

export type UnionLinkButtonNavigationProps = HrefNavigationProps | LinkButtonNavigationProps | ButtonNavigationProps | AnchorNavigationProps;

export type LinkButtonRawProps = React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Represents the Core properties of the LinkButton component. */
export type LinkButtonCoreProps = IClickable & IAnalyticableClick & IHasTabIndex & IDisableable & IHasCX & Omit<ICanRedirect, 'href' | 'link'>
& IDropdownToggler & IHasIcon & IHasCaption & UnionLinkButtonNavigationProps & IHasRawProps<LinkButtonRawProps> & {
    /**
     * CSS classes to put on the caption
     * @deprecated
     * */
    captionCX?: CX;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /**
     * Defines component size.
     * @default '36'
     */
    size?: types.ControlSize | '42';
};

/** Represents the properties of the LinkButton component. */
export type LinkButtonProps = LinkButtonCoreProps & LinkButtonMods;

function applyLinkButtonMods(mods: LinkButtonProps) {
    return [
        'uui-link_button',
        css.root,
        `uui-size-${mods.size || DEFAULT_SIZE}`,
        ...getIconClass(mods),
        `uui-color-${mods.color || DEFAULT_COLOR}`,
    ];
}

export const LinkButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, LinkButtonProps>((props, ref) => {
    if (__DEV__ && props.captionCX) {
        devLogger.warn('LinkButton: Property \'captionCX\' is deprecated and will be removed in the future release. Please use \'cx\' prop to access caption styles and use cascading to change the styles for the \'uui-caption\' global class');
    }

    const styles = [applyLinkButtonMods(props), props.cx];

    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : systemIcons[props.size || DEFAULT_SIZE].foldingArrow;

    return (
        <Clickable
            { ...props }
            cx={ styles }
            ref={ ref }
            rawProps={ {
                type: props.rawProps?.type || 'button',
                ...props.rawProps,
            } }
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
            { props.icon && props.iconPosition === 'right' && (
                <IconContainer icon={ props.icon } onClick={ !props.isDisabled ? props.onIconClick : undefined } />
            ) }
            { props.isDropdown && (
                <IconContainer icon={ DropdownIcon } flipY={ props.isOpen } />
            ) }
        </Clickable>
    );
});

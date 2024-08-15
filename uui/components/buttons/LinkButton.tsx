import * as React from 'react';
import { Icon, devLogger, IDropdownToggler, IHasCaption, IHasIcon, uuiElement, Overwrite } from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import * as types from '../types';
import { systemIcons } from '../../icons/icons';
import { settings } from '../../settings';
import { getIconClass } from './helper';
import css from './LinkButton.module.scss';

const DEFAULT_COLOR = 'primary';
const DEFAULT_WEIGHT = 'semibold';
const DEFAULT_UNDERLINE_STYLE = 'none';

interface LinkButtonMods {
    /**
     * Defines component color
     * @default 'primary'
     */
    color?: 'primary' | 'secondary' | 'accent' | 'critical' | 'white' | 'contrast';
    /**
     * Defines component font-weight
     * @default 'semibold'
     */
    weight?: 'semibold' | 'regular';
    /**
     * Defines component underline style
     * @default 'none'
     */
    underline?: 'line' | 'dashed' | 'none';
}

/** Represents the Core properties of the LinkButton component. */
export interface LinkButtonCoreProps extends ClickableComponentProps, IDropdownToggler, IHasIcon, IHasCaption {
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /**
     * Defines component size.
     * @default '36'
     */
    size?: types.ControlSize | '42';
}

export interface LinkButtonModsOverride {}

/** Represents the properties of the LinkButton component. */
export interface LinkButtonProps extends LinkButtonCoreProps, Overwrite<LinkButtonMods, LinkButtonModsOverride> {}

function applyLinkButtonMods(mods: LinkButtonProps) {
    return [
        'uui-link_button',
        css.root,
        `uui-size-${mods.size || settings.sizes.defaults.linkButton}`,
        ...getIconClass(mods),
        `uui-color-${mods.color || DEFAULT_COLOR}`,
        `uui-weight-${mods.weight || DEFAULT_WEIGHT}`,
        `uui-underline-${mods.underline || DEFAULT_UNDERLINE_STYLE}`,
    ];
}

export const LinkButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, LinkButtonProps>((props, ref) => {
    if (__DEV__ && props.color === 'contrast') {
        devLogger.warnAboutDeprecatedPropValue<LinkButtonProps, 'color'>({
            component: 'LinkButton',
            propName: 'color',
            propValue: props.color,
            propValueUseInstead: 'white',
            condition: () => props.color === 'contrast',
        });
    }

    const styles = [applyLinkButtonMods(props), props.cx];

    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : systemIcons.foldingArrow;

    return (
        <Clickable
            { ...props }
            type="button"
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
                <div className={ uuiElement.caption }>
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

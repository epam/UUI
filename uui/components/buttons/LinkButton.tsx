import * as React from 'react';
import { Icon, devLogger, IDropdownToggler, IHasCaption, IHasIcon, uuiElement, Overwrite } from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import * as types from '../types';
import { systemIcons } from '../../icons/icons';
import { settings } from '../../settings';
import { getIconClass } from './helper';
import cx from 'classnames';
import css from './LinkButton.module.scss';

const DEFAULT_COLOR = 'primary';
const DEFAULT_WEIGHT = 'semibold';

interface LinkButtonMods {
    /**
     * Defines component color
     * @default 'primary'
     */
    color?: 'primary' | 'secondary' | 'accent' | 'critical' | 'white' | 'contrast';
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
    /**
     * Defines component font-weight
     * @default 'semibold'
     */
    weight?: 'semibold' | 'regular';
    /**
     * Defines component underline style
     */
    underline?: 'solid' | 'dashed';
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

    const weightMap = {
        semibold: '600',
        regular: '400',
    };

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
                <div
                    className={ cx(uuiElement.caption, props.underline && `uui-underline-${props.underline}`) }
                    style={ { '--uui-link-button-font-weight': weightMap[props.weight || DEFAULT_WEIGHT] } as React.CSSProperties }
                >
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

import React from 'react';
import {
    Icon, IDropdownToggler, IHasCaption, IHasIcon, Overwrite, uuiElement,
} from '@epam/uui-core';
import { Clickable, ClickableComponentProps, ControlIcon, IconContainer } from '@epam/uui-components';
import { CountIndicator } from './CountIndicator';
import { settings } from '../../settings';

import css from './Tag.module.scss';

interface TagMods {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: 'info' | 'success' | 'warning' | 'critical' | 'neutral';
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '18' | '24' | '30' | '36' | '42' | '48';
}

export interface TagModsOverride {}

/** Represents the Core properties of the Tag component. */
export type TagCoreProps = ClickableComponentProps & IDropdownToggler & IHasIcon & IHasCaption & {
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: 'solid' | 'outline';
    /** Call to clear toggler value */
    onClear?(e?: any): void;
    /** Icon for clear value button (usually cross) */
    clearIcon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /** Count value to be placed in component */
    count?: React.ReactNode;
};

/** Represents the properties of the Tag component. */
export interface TagProps extends TagCoreProps, Overwrite<TagMods, TagModsOverride> {}

function applyTagMods(props: TagProps) {
    return [
        css.root,
        `uui-size-${props.size || settings.tag.sizes.default}`,
        `uui-color-${props.color || 'neutral'}`,
        `uui-fill-${props.fill || 'solid'}`,
        'uui-tag',
    ];
}

export const Tag = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, TagProps>((props, ref) => {
    const styles = [applyTagMods(props), props.cx];

    const ClearIcon = props.clearIcon ? props.clearIcon : settings.tag.icons.clearIcon;
    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : settings.tag.icons.dropdownIcon;

    const icon = (
        <ControlIcon
            icon={ props.icon }
            onClick={ props.onIconClick }
            isDisabled={ props.isDisabled }
            rawProps={ {
                'aria-label': 'Icon in input',
            } }
        />
    );

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
            { props.iconPosition !== 'right' && icon }
            { props.caption && (
                <div className={ uuiElement.caption }>
                    { props.caption }
                </div>
            ) }
            { props.count !== undefined && props.count !== null && (
                <CountIndicator
                    color={ (!props.color || props.color === 'neutral') ? 'white' : props.color }
                    size={ settings.tag.sizes.countIndicatorMap[(props.size || settings.tag.sizes.default)] }
                    caption={ props.count }
                />
            ) }
            { props.iconPosition === 'right' && icon }
            { props.isDropdown && (
                <IconContainer icon={ DropdownIcon } flipY={ props.isOpen } />
            )}
            { props.onClear && !props.isDisabled && (
                <ControlIcon
                    cx="uui-icon-cancel"
                    icon={ ClearIcon }
                    onClick={ props.onClear }
                    rawProps={ {
                        'aria-label': 'Remove tag',
                    } }
                />
            ) }
        </Clickable>
    );
});

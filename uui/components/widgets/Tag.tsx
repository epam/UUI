import React from 'react';
import { CX, cx, devLogger, Icon, IDropdownToggler, IHasCaption, IHasIcon, uuiElement, uuiMarkers } from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import { CountIndicator, CountIndicatorProps } from './CountIndicator';
import { systemIcons } from '../../icons/icons';
import css from './Tag.module.scss';

const DEFAULT_SIZE = '36';

const mapCountIndicatorSizes: Record<TagCoreProps['size'], CountIndicatorProps['size']> = {
    18: '12',
    24: '18',
    30: '18',
    36: '18',
    42: '24',
    48: '24',
};

interface TagMods {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: 'info' | 'success' | 'warning' | 'critical' | 'neutral';
}

/** Represents the Core properties of the Tag component. */
export type TagCoreProps = ClickableComponentProps & IDropdownToggler & IHasIcon & IHasCaption & {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '18' | '24' | '30' | '36' | '42' | '48';
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: 'solid' | 'outline';
    /** Call to clear toggler value */
    onClear?(e?: any): void;
    /** Icon for clear value button (usually cross) */
    clearIcon?: Icon;
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

/** Represents the properties of the Tag component. */
export type TagProps = TagCoreProps & TagMods;

function applyTagMods(props: TagProps) {
    return [
        css['size-' + (props.size || DEFAULT_SIZE)],
        css.root,
        `uui-color-${props.color || 'neutral'}`,
        `uui-fill-${props.fill || 'solid'}`,
        'uui-tag',
    ];
}

export const Tag = /* @__PURE__ */React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, TagProps>((props, ref) => {
    if (__DEV__ && props.captionCX) {
        devLogger.warn('Tag: Property \'captionCX\' is deprecated and will be removed in the future release. Please use \'cx\' prop to access caption styles and use cascading to change the styles for the \'uui-caption\' global class');
    }

    const styles = [applyTagMods(props), props.cx];

    const ClearIcon = props.clearIcon ? props.clearIcon : systemIcons.clear;
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
                    color={ (!props.color || props.color === 'neutral') ? 'white' : props.color }
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
            { props.onClear && !props.isDisabled && (
                <IconContainer cx={ uuiMarkers.clickable } icon={ ClearIcon } onClick={ props.onClear } />
            ) }
        </Clickable>
    );
});

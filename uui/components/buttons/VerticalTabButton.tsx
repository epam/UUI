import React, { CSSProperties } from 'react';
import {
    cx,
    IHasCaption,
    IHasIcon,
    uuiElement,
    Overwrite,
    DataRowProps,
    uuiMarkers,
    uuiMod,
    useIsActive,
    ICanBeActive,
    devLogger, Icon,
} from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import { getIconClass } from './helper';
import { settings } from '../../settings';

import css from './VerticalTabButton.module.scss';
import { CountIndicator } from '../widgets';

type VerticalTabButtonMods = {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '30' | '36' | '48';
    /**
     * Defines component font-weight
     * @default 'semibold'
     */
    weight?: 'semibold' | 'regular';
};

export interface VerticalTabButtonModsOverride {}

/** Represents the properties of a VerticalTabButton component. */
export type VerticalTabButtonProps<TItem, TId> = Partial<Pick<DataRowProps<TItem, TId>, 'indent' | 'isFolded' | 'isFoldable'>> & Overwrite<VerticalTabButtonMods, VerticalTabButtonModsOverride> & ClickableComponentProps & IHasIcon & IHasCaption & ICanBeActive & {
    /**
     * Defines callback for rendering additional actions and items in the VerticalTabButton.
     */
    renderAddons?: () => React.ReactNode;
    /** Defines is the component showing Notify */
    withNotify?: boolean;
    /**
     * Handles folding change.
     */
    onFold?: () => void;
    /**
     * When isDropdown=true, indicate that dropdown is open with chevron icon
     */
    isOpen?: boolean;
    /**
     * Shows chevron icon, enabling component to act as dropdown toggler
     */
    isDropdown?: boolean;
    /**
     * Icon for dropdown toggler
     */
    dropdownIcon?: Icon;
    /**
     * @deprecated
     * Call to clear toggler value
     */
    onClear?(e?: any): void;
    /**
     * @deprecated
     * Icon for clear value button (usually cross)
     */
    clearIcon?: Icon;
    /**
     * @deprecated
     * Count value to be placed in component
     */
    count?: React.ReactNode;
};

function VerticalTabButtonComponent<TItem, TId>(
    props: VerticalTabButtonProps<TItem, TId>,
    ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement>,
) {
    const { isActive } = useIsActive({
        isLinkActive: props.isLinkActive,
        link: props.link,
        isActive: props.isActive,
    });

    const styles = [
        css.root,
        'uui-vertical-tab-button',
        `uui-size-${props.size || settings.tabButton.sizes.default}`,
        isActive && uuiMod.active,
        props.indent > 0 && css.noLeftPadding,
        !props.onClick && props.onFold && css.onlyFoldable,
        ...getIconClass(props),
        props.cx,
    ];

    if (props.count !== undefined && props.count !== null) {
        devLogger.warnAboutDeprecatedPropValue<VerticalTabButtonProps<TItem, TId>, 'count'>({
            component: 'VerticalTabButton',
            propName: 'count',
            propValue: props.count,
            propValueUseInstead: 'renderAddons',
        });
    }

    if (props.onClear !== undefined && props.onClear !== null) {
        devLogger.warn('VerticalTabButton: onClear prop is deprecated. Use renderAddons prop instead.');
    }

    if (props.clearIcon !== undefined && props.clearIcon !== null) {
        devLogger.warn('VerticalTabButton: clearIcon prop is deprecated. Use renderAddons prop instead.');
    }

    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : settings.verticalTabButton.icons.dropdownIcon;
    const ClearIcon = props.clearIcon ? props.clearIcon : settings.verticalTabButton.icons.clearIcon;

    return (
        <Clickable
            { ...props }
            onClick={ props.onClick || props.onFold }
            rawProps={ {
                role: 'tab',
                ...props.rawProps,
            } }
            cx={ styles }
            ref={ ref }
        >
            {props.indent > 0 && (
                <div
                    key="fold"
                    className={ cx(css.foldingArea, props.onFold && uuiMarkers.clickable) }
                    style={ { '--uui-folding-indent': `${props.indent - 1}` } as CSSProperties }
                    onClick={ props.onFold }
                >
                    {props.isFoldable && (
                        <IconContainer
                            rawProps={ {
                                'aria-label': props.isFolded ? 'Unfold' : 'Fold',
                                role: 'button',
                            } }
                            key="icon"
                            icon={ settings.verticalTabButton.icons.foldingIcon }
                            cx={ [
                                uuiElement.foldingArrow, css.iconContainer,
                            ] }
                            rotate={ props.isFolded ? '90ccw' : '0' }
                            size={ settings.dataTable.sizes.body.iconMap[props.size || settings.dataTable.sizes.body.row] }
                        />
                    )}
                </div>
            )}
            { props.icon && props.iconPosition !== 'right' && (
                <IconContainer
                    icon={ props.icon }
                    onClick={ !props.isDisabled ? props.onIconClick : undefined }
                />
            ) }
            { (props.caption || props.withNotify) && (
                <div className={ css.captionWrapper }>
                    { props.caption && <div className={ cx(uuiElement.caption, `uui-vertical-tab-button-weight-${props.weight || settings.verticalTabButton.weight}`) }>{ props.caption }</div> }
                    { props.withNotify && <div className={ css.withNotify } /> }
                </div>
            ) }
            { props.icon && props.iconPosition === 'right' && (
                <IconContainer icon={ props.icon } onClick={ !props.isDisabled ? props.onIconClick : undefined } />
            ) }
            { props.count !== undefined && props.count !== null && (
                <CountIndicator
                    color="neutral"
                    size={ settings.verticalTabButton.sizes.countIndicatorMap[props.size || settings.verticalTabButton.sizes.default] }
                    caption={ props.count }
                />
            ) }
            { props.isDropdown && (
                <IconContainer icon={ DropdownIcon } flipY={ props.isOpen } />
            )}
            { props.onClear && !props.isDisabled && (
                <IconContainer cx={ uuiMarkers.clickable } icon={ ClearIcon } onClick={ props.onClear } />
            ) }
            { props.renderAddons && props.renderAddons() }
        </Clickable>
    );
}

export const VerticalTabButton = React.forwardRef(VerticalTabButtonComponent) as
    <TItem, TId>(props: VerticalTabButtonProps<TItem, TId> & { ref?: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement> }) =>
    ReturnType<typeof VerticalTabButtonComponent>;

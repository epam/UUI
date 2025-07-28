import React from 'react';
import { cx, Icon, IDropdownToggler, IHasCaption, IHasIcon, uuiElement, uuiMarkers, Overwrite } from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import { getIconClass } from './helper';
import { CountIndicator } from '../widgets/CountIndicator';
import { settings } from '../../settings';

import css from './TabButton.module.scss';

type TabButtonMods = {
    /**
     * Defines component size.
     * @default '48'
     */
    size?: '36' | '48' | '60';
    /** Defines is the component showing Notify */
    withNotify?: boolean;
};

export interface TabButtonModsOverride {}

/** Represents the properties of a TabButton component. */
export interface TabButtonProps extends Overwrite<TabButtonMods, TabButtonModsOverride>, ClickableComponentProps, IDropdownToggler, IHasIcon, IHasCaption {
    /** Call to clear toggler value */
    onClear?(e?: any): void;
    /** Icon for clear value button (usually cross) */
    clearIcon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
    /** Count value to be placed in component */
    count?: React.ReactNode;
}

export const TabButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, TabButtonProps>((props, refExternal) => {
    const refLocal = React.useRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement | null>(null);
    const ref = refExternal ?? refLocal;

    const styles = [
        css.root,
        'uui-tab-button',
        `uui-size-${props.size || settings.tabButton.sizes.default}`,
        ...getIconClass(props),
        props.cx,
    ];

    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : settings.tabButton.icons.dropdownIcon;
    const ClearIcon = props.clearIcon ? props.clearIcon : settings.tabButton.icons.clearIcon;

    type OnKeyDownEvent =
        & React.KeyboardEvent<HTMLAnchorElement>
        & React.KeyboardEvent<HTMLButtonElement>
        & React.KeyboardEvent<HTMLSpanElement>;

    const handleOnKeyDown = (event: OnKeyDownEvent): void => {
        props.rawProps?.onKeyDown?.(event);

        const isLink = (
            props.link !== undefined
            || props.href !== undefined
        );

        if (
            isLink
            && event.code === 'Space'
            && typeof ref != 'function'
        ) {
            ref.current?.click();
        }
    };

    return (
        <Clickable
            { ...props }
            rawProps={ {
                role: 'tab',
                'aria-haspopup': props.isDropdown,
                'aria-expanded': props.isOpen,
                ...props.rawProps,
                onKeyDown: handleOnKeyDown,
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
            { (props.caption || props.withNotify) && (
                <div className={ cx(uuiElement.caption) }>
                    { props.caption }
                    { props.withNotify && <div className={ css.withNotify } /> }
                </div>
            ) }
            { props.icon && props.iconPosition === 'right' && (
                <IconContainer icon={ props.icon } onClick={ !props.isDisabled ? props.onIconClick : undefined } />
            ) }
            { props.count !== undefined && props.count !== null && (
                <CountIndicator
                    color="neutral"
                    size={ settings.tabButton.sizes.countIndicatorMap[props.size || settings.tabButton.sizes.default] }
                    caption={ props.count }
                />
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

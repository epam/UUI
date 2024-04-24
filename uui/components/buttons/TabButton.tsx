import React from 'react';
import { CX, cx, devLogger, Icon, IDropdownToggler, IHasCaption, IHasIcon, uuiElement, uuiMarkers } from '@epam/uui-core';
import { Clickable, ClickableComponentProps, IconContainer } from '@epam/uui-components';
import { getIconClass } from './helper';
import { CountIndicator } from '../widgets';
import { systemIcons } from '../../icons/icons';
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

const DEFAULT_SIZE = '48';

/** Represents the properties of a TabButton component. */
export type TabButtonProps = TabButtonMods & ClickableComponentProps & IDropdownToggler & IHasIcon & IHasCaption & {
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

function applyTabButtonMods(mods: TabButtonProps) {
    return [
        css.root,
        'uui-tab-button',
        `uui-size-${mods.size || DEFAULT_SIZE}`,
        mods.withNotify && css.withNotify,
        ...getIconClass(mods),
    ];
}

export const TabButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, TabButtonProps>((props, ref) => {
    if (__DEV__ && props.captionCX) {
        devLogger.warn('TabButton/VerticalTabButton: Property \'captionCX\' is deprecated and will be removed in the future release. Please use \'cx\' prop to access caption styles and use cascading to change the styles for the \'uui-caption\' global class');
    }

    const styles = [applyTabButtonMods(props), props.cx];

    const DropdownIcon = props.dropdownIcon ? props.dropdownIcon : systemIcons.foldingArrow;
    const ClearIcon = props.clearIcon ? props.clearIcon : systemIcons.clear;

    return (
        <Clickable
            { ...props }
            rawProps={ {
                role: 'tab',
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
                <div className={ cx(uuiElement.caption, props.captionCX, props.withNotify && css.captionWithNotify) }>
                    { props.caption }
                </div>
            ) }
            { props.count !== undefined && props.count !== null && (
                <CountIndicator
                    color={ props.isLinkActive ? 'info' : 'neutral' }
                    size="18"
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

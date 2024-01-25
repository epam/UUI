import * as React from 'react';
import {
    Icon, uuiElement, uuiMarkers, CX, cx, IHasIcon, IDropdownToggler, IHasCaption, devLogger, IClickable,
    IAnalyticableClick, IHasTabIndex, IDisableable, IHasCX, ICanRedirect, IHasRawProps,
} from '@epam/uui-core';
import { AnchorNavigationProps, ButtonNavigationProps, Clickable, HrefNavigationProps, LinkButtonNavigationProps } from '../widgets';
import { IconContainer } from '../layout';
import css from './Button.module.scss';

export type UnionButtonNavigationProps = HrefNavigationProps | LinkButtonNavigationProps | ButtonNavigationProps | AnchorNavigationProps;

export type ButtonRawProps = React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = IClickable & IAnalyticableClick & IHasTabIndex & IDisableable & IHasCX & ICanRedirect
& IDropdownToggler & IHasIcon & IHasCaption & UnionButtonNavigationProps & IHasRawProps<ButtonRawProps> & {
    /** Call to clear toggler value */
    onClear?(e?: any): void;
    /** Icon for clear value button (usually cross) */
    clearIcon?: Icon;
    /**
     * CSS classes to put on the caption
     * @deprecated
     */
    captionCX?: CX;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
};

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
    if (__DEV__ && props.captionCX) {
        devLogger.warn('Button: Property \'captionCX\' is deprecated and will be removed in the future release. Please use \'cx\' prop to access caption styles and use cascading to change the styles for the \'uui-caption\' global class');
    }

    return (
        <Clickable
            { ...props }
            href={ props.href }
            rawProps={ {
                'aria-haspopup': props.isDropdown,
                'aria-expanded': props.isOpen,
                type: props.rawProps?.type || 'button',
                ...props.rawProps as UnionButtonNavigationProps,
            } }
            cx={ [css.container, props.cx] }
            ref={ ref }
        >
            { props.icon && props.iconPosition !== 'right' && (
                <IconContainer
                    icon={ props.icon }
                    onClick={ !props.isDisabled ? props.onIconClick : undefined }
                />
            )}
            { props.caption && (
                <div className={ cx(uuiElement.caption, props.captionCX) }>
                    { props.caption }
                </div>
            )}
            { props.icon && props.iconPosition === 'right' && (
                <IconContainer icon={ props.icon } onClick={ !props.isDisabled ? props.onIconClick : undefined } />
            ) }
            { props.isDropdown && (
                <IconContainer icon={ props.dropdownIcon } flipY={ props.isOpen } />
            ) }
            { props.onClear && !props.isDisabled && (
                <IconContainer cx={ uuiMarkers.clickable } icon={ props.clearIcon } onClick={ props.onClear } />
            ) }
        </Clickable>
    );
});

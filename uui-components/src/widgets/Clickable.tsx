import React, { ForwardedRef, PropsWithChildren } from 'react';
import {
    cx, isEventTargetInsideClickable, uuiMod, uuiElement, uuiMarkers, useUuiContext, IHasRawProps,
    IClickable, IDisableable, IAnalyticableClick, IHasTabIndex, IHasCX, Link, ICanRedirect,
} from '@epam/uui-core';

export type HrefNavigationProps = {
    /** The URL that the hyperlink points to. */
    href: string | never;
    /** Defines location within SPA application */
    link?: never;
};

export type LinkButtonNavigationProps = {
    /** The URL that the hyperlink points to. */
    href?: never;
    /** Defines location within SPA application */
    link: Link;
};

export type ButtonNavigationProps = {
    /** The URL that the hyperlink points to. */
    href?: never;
    /** Defines location within SPA application */
    link?: never;
};

export type SpanNavigationProps = {
    /** The URL that the hyperlink points to. */
    href?: never;
    /** Defines location within SPA application */
    link?: never;
};

export type AnchorNavigationProps = {
    /** The URL that the hyperlink points to. */
    href: string;
    /** Defines location within SPA application */
    link: Link;
};

export type UnionNavigationProps =
    | HrefNavigationProps
    | LinkButtonNavigationProps
    | ButtonNavigationProps
    | SpanNavigationProps
    | AnchorNavigationProps;

export type ClickableRawProps = React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement> | React.HTMLAttributes<HTMLSpanElement>;

export type ClickableComponentProps = IClickable & IAnalyticableClick & IHasTabIndex & IDisableable & IHasCX
& Omit<ICanRedirect, 'href' | 'link'> & UnionNavigationProps & IHasRawProps<ClickableRawProps> & {};

export const Clickable = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, PropsWithChildren<ClickableComponentProps>>((props, ref) => {
    const context = useUuiContext();
    const isAnchor = Boolean(props.href || props.link);
    const isButton = Boolean(!isAnchor && ((props.rawProps as React.ButtonHTMLAttributes<HTMLButtonElement>)?.type || props.onClick));
    const hasClick = Boolean(!props.isDisabled && (props.link || props.onClick));
    const getIsLinkActive = () => {
        if (props.isLinkActive !== undefined) {
            return props.isLinkActive;
        } else {
            return props.link ? context.uuiRouter?.isActive(props.link) : false;
        }
    };

    const clickHandler = (e: React.MouseEvent) => {
        if (!isEventTargetInsideClickable(e) && !props.isDisabled) {
            if (props.onClick) {
                props.onClick(e);
            }

            if (!!props.link) {
                if (props.target) {
                    e.stopPropagation();
                    return;
                }

                e.preventDefault();
                context.uuiRouter.redirect(props.link);
            }

            context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
        }
    };

    const getTabIndex = () => {
        if (!props.tabIndex && (props.isDisabled || (!props.onClick && !props.link && !props.href))) {
            return -1;
        }

        return props.tabIndex || 0;
    };

    const getHref = () => props.link ? context.uuiRouter?.createHref(props.link) : props.href;

    const className = cx(
        {
            [uuiElement.buttonBox]: true,
            [uuiMod.enabled]: !props.isDisabled,
            [uuiMod.disabled]: props.isDisabled,
            [uuiMod.active]: getIsLinkActive(),
            [uuiMarkers.clickable]: isAnchor || hasClick,
            [uuiElement.anchor]: isAnchor,
        },
        props.cx,
    );

    const commonProps = {
        className,
        onClick: hasClick ? clickHandler : undefined,
        tabIndex: getTabIndex(),
        'aria-disabled': props.isDisabled,
        // NOTE: do not use disabled attribute for button because it will prevent all events and broke Tooltip at least
        // more info: https://github.com/epam/UUI/issues/1057#issuecomment-1508632942
        // disabled: props.isDisabled,
    };

    if (isAnchor) {
        const { target } = props;
        const relProp = target === '_blank' ? { rel: 'noopener noreferrer' } : {};
        const href = !props.isDisabled ? getHref() : undefined;

        return (
            <a
                href={ href }
                target={ target }
                ref={ ref as ForwardedRef<HTMLAnchorElement> }
                { ...relProp }
                { ...commonProps }
                { ...props.rawProps as React.AnchorHTMLAttributes<HTMLAnchorElement> }
            >
                { props.children }
            </a>
        );
    }

    if (isButton) {
        return (
            <button
                ref={ ref as ForwardedRef<HTMLButtonElement> }
                { ...commonProps }
                { ...props.rawProps as React.ButtonHTMLAttributes<HTMLButtonElement> }
            >
                { props.children }
            </button>
        );
    }

    return (
        <span
            ref={ ref as ForwardedRef<HTMLSpanElement> }
            { ...commonProps }
            { ...props.rawProps as React.HTMLAttributes<HTMLSpanElement> }
        >
            { props.children }
        </span>
    );
});

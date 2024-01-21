import React, { PropsWithChildren } from 'react';
import {
    cx, isEventTargetInsideClickable, uuiMod, uuiElement, uuiMarkers, useUuiContext,
    IClickable, IDisableable, IAnalyticableClick, IHasTabIndex, IHasCX, IHasRawProps, Link, ICanRedirect,
} from '@epam/uui-core';

export type HrefRawProps = {
    /** Any HTML attributes (native or 'data-') to put on the underlying component */
    rawProps?: IHasRawProps<React.AnchorHTMLAttributes<HTMLAnchorElement>>['rawProps'];
    /** The URL that the hyperlink points to. */
    href: string | never;
    /** Defines location within SPA application */
    link?: never;
};

export type LinkButtonRawProps = {
    /** Any HTML attributes (native or 'data-') to put on the underlying component */
    rawProps?: IHasRawProps<React.AnchorHTMLAttributes<HTMLAnchorElement>>['rawProps'];
    /** The URL that the hyperlink points to. */
    href?: never;
    /** Defines location within SPA application */
    link: Link;
};

export type ButtonRawProps = {
    /** Any HTML attributes (native or 'data-') to put on the underlying component */
    rawProps?: IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>>['rawProps'];
    /** The URL that the hyperlink points to. */
    href?: never;
    /** Defines location within SPA application */
    link?: never;
};

export type SpanRawProps = {
    /** Any HTML attributes (native or 'data-') to put on the underlying component */
    rawProps?: IHasRawProps<React.HTMLAttributes<HTMLSpanElement>>['rawProps'];
    /** The URL that the hyperlink points to. */
    href?: never;
    /** Defines location within SPA application */
    link?: never;
};

export type AnchorRawProps = {
    /** Any HTML attributes (native or 'data-') to put on the underlying component */
    rawProps?: IHasRawProps<React.AnchorHTMLAttributes<HTMLAnchorElement>>['rawProps'];
    /** The URL that the hyperlink points to. */
    href: string;
    /** Defines location within SPA application */
    link: Link;
};

export type UnionRawProps = HrefRawProps | LinkButtonRawProps | ButtonRawProps | SpanRawProps | AnchorRawProps;

export type ClickableComponentProps = IClickable & IAnalyticableClick & IHasTabIndex & IDisableable & IHasCX
& ICanRedirect & UnionRawProps & {};

export const Clickable = React.forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, PropsWithChildren<ClickableComponentProps>>((props, ref) => {
    const context = useUuiContext();
    const isAnchor = Boolean(props.href || props.link);
    const isButton = Boolean(!isAnchor && props.onClick);
    const isClickable = Boolean(!props.isDisabled && (isAnchor || props.onClick));
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
            [uuiMarkers.clickable]: isClickable,
            [uuiElement.anchor]: isAnchor,
        },
        props.cx,
    );

    const commonProps = {
        ref,
        className,
        onClick: isClickable ? clickHandler : undefined,
        tabIndex: getTabIndex(),
        'aria-disabled': props.isDisabled,
        // NOTE: do not use disabled attribute for button because it will prevent all events and broke Tooltip at least
        // more info: https://github.com/epam/UUI/issues/1057#issuecomment-1508632942
        // disabled: props.isDisabled,
        ...props.rawProps,
    };

    if (isAnchor) {
        const { target } = props;
        const relProp = target === '_blank' ? { rel: 'noopener noreferrer' } : {};
        const href = !props.isDisabled ? getHref() : undefined;

        return React.createElement('a', {
            role: 'link', href, target, ...relProp, ...commonProps,
        }, props.children);
    }

    if (isButton) {
        return React.createElement('button', { type: 'button', ...commonProps }, props.children);
    }

    return React.createElement('span', commonProps, props.children);
});

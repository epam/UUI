import React, { ForwardedRef, PropsWithChildren } from 'react';
import {
    cx, isEventTargetInsideClickable, uuiMod, uuiElement, uuiMarkers, useUuiContext, IHasRawProps,
    IClickable, IDisableable, IAnalyticableClick, IHasTabIndex, IHasCX, ICanRedirect,
} from '@epam/uui-core';

type ClickableType = {
    /**
     * Can pass the desired type of Clickable component
     */
    type?: 'button' | 'anchor'
};
type ClickableForwardedRef = HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement;

export type ClickableRawProps = React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement> | React.HTMLAttributes<HTMLSpanElement>;

export type ClickableComponentProps = IClickable & IAnalyticableClick & IHasTabIndex & IDisableable & IHasCX
& ICanRedirect & IHasRawProps<ClickableRawProps> & {
    /** Called when keyDown event is fired on component */
    onKeyDown?: (e: React.KeyboardEvent) => void;
};

export const Clickable = React.forwardRef<ClickableForwardedRef, PropsWithChildren<ClickableComponentProps & ClickableType>>((props, ref) => {
    const context = useUuiContext();
    const isAnchor = Boolean(props.href || props.link || props.type === 'anchor');
    const isButton = Boolean(!isAnchor && (props.onClick || props.type === 'button'));
    const hasClick = Boolean(!props.isDisabled && (props.link || props.onClick || props.clickAnalyticsEvent));

    const clickHandler = (e: React.MouseEvent) => {
        if (isEventTargetInsideClickable(e) && !props.isDisabled) {
            e.preventDefault(); // If it was click on another clickable element, we should also make preventDefault, to disable redirect by href attribute
            return;
        }

        if (props.onClick) {
            props.onClick(e);
        }

        if (!!props.link) {
            if (props.target) { // if target _blank we should not invoke redirect
                return;
            }

            e.preventDefault();
            context.uuiRouter.redirect(props.link);
        }

        context.uuiAnalytics.sendEvent(props.clickAnalyticsEvent);
    };

    const getTabIndex = () => {
        if (!props.tabIndex && (props.isDisabled || (!props.onClick && !props.onKeyDown && !props.link && !props.href))) {
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
            [uuiMarkers.clickable]: isAnchor || hasClick,
            [uuiElement.anchor]: isAnchor,
        },
        props.cx,
    );

    const commonProps = {
        className,
        onClick: hasClick ? clickHandler : undefined,
        onKeyDown: !props.isDisabled ? props.onKeyDown : undefined,
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
                type={ (props.rawProps as any)?.type || 'button' }
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

import React from 'react';
import {
    handleSpaceKey, uuiMod, uuiElement, uuiMarkers, IHasRawProps, UuiContext, IHasForwardedRef,
    IHasCX, ICanRedirect, IHasChildren, UuiContexts, IDisableable, IClickable, cx, IAnalyticableClick,
} from '@epam/uui-core';
import { ButtonBase } from '../buttons';
import css from './Anchor.scss';

export interface AnchorProps extends IHasCX, ICanRedirect, IHasChildren, IDisableable, IClickable, IAnalyticableClick, IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>>, IHasForwardedRef<HTMLAnchorElement | HTMLButtonElement> { }

export class AnchorImpl extends ButtonBase<AnchorProps> {
    static contextType = UuiContext;
    context: UuiContexts;

    handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        !this.props.isDisabled && handleSpaceKey(e, this.clickHandler);
    }

    render() {
        let isActive = false;
        let href: string;

        const { target, link, forwardedRef, isDisabled, isLinkActive } = this.props;
        if (link) {
            isActive = this.context.uuiRouter?.isActive(link);
            href = this.context.uuiRouter?.createHref(link);
        } else if (this.props.href) {
            href = this.props.href;
        }

        return React.createElement('a', {
            className: cx(
                css.container,
                uuiElement.anchor,
                isDisabled ? uuiMod.disabled : uuiMod.enabled,
                (isLinkActive || isActive) && uuiMod.active,
                uuiMarkers.clickable,
                this.props.cx,
            ),
            tabIndex: isDisabled ? -1 : 0,
            href,
            role: 'link',
            target,
            ...(target ? { rel: 'noopener noreferrer' } : {}),
            ref: forwardedRef,
            onClick: this.clickHandler,
            onKeyDown: this.handleKeyDown,
            disabled: isDisabled,
            "aria-disabled": isDisabled,
            ...this.props.rawProps,
        }, this.props.children);
    }
}

export const Anchor = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, AnchorProps>(
    (props, ref) => <AnchorImpl { ...props } forwardedRef={ ref } />,
);

Anchor.displayName = 'Anchor';

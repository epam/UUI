import React from 'react';
import {
    handleSpaceKey,
    uuiMod,
    uuiElement,
    uuiMarkers,
    IHasRawProps,
    UuiContext,
    IHasForwardedRef,
    IHasCX,
    ICanRedirect,
    IHasChildren,
    UuiContexts,
    IDisableable,
    IClickable,
    cx,
    IAnalyticableClick,
} from '@epam/uui-core';
import { ButtonBase } from '../buttons';
import css from './Anchor.scss';

export interface AnchorProps
    extends IHasCX,
        ICanRedirect,
        IHasChildren,
        IDisableable,
        IClickable,
        IAnalyticableClick,
        IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>>,
        IHasForwardedRef<HTMLAnchorElement | HTMLButtonElement> {}

export class AnchorImpl extends ButtonBase<AnchorProps> {
    static contextType = UuiContext;
    context: UuiContexts;

    handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        !this.props.isDisabled && handleSpaceKey(e, this.clickHandler);
    };

    render() {
        let isActive = false;
        let href: string;

        if (this.props.link) {
            isActive = this.context.uuiRouter?.isActive(this.props.link);
            href = this.context.uuiRouter?.createHref(this.props.link);
        } else if (this.props.href) {
            href = this.props.href;
        }

        const { target } = this.props;
        const relProp = target === '_blank' ? { rel: 'noopener noreferrer' } : {};

        return React.createElement(
            'a',
            {
                className: cx(
                    css.container,
                    uuiElement.anchor,
                    this.props.isDisabled ? uuiMod.disabled : uuiMod.enabled,
                    (this.props.isLinkActive || isActive) && uuiMod.active,
                    uuiMarkers.clickable,
                    this.props.cx
                ),
                tabIndex: this.props.isDisabled ? -1 : 0,
                href,
                role: 'link',
                target,
                ...relProp,
                ref: this.props.forwardedRef,
                onClick: this.clickHandler,
                onKeyDown: this.handleKeyDown,
                disabled: this.props.isDisabled,
                'aria-disabled': this.props.isDisabled,
                ...this.props.rawProps,
            },
            this.props.children
        );
    }
}

export const Anchor = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, AnchorProps>((props, ref) => (
    <AnchorImpl {...props} forwardedRef={ref} />
));

Anchor.displayName = 'Anchor';

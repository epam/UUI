import React from 'react';
import {
    cx,
    ButtonBaseCoreProps,
    IHasForwardedRef,
    UuiContexts,
    isClickableChildClicked,
    uuiMod,
    uuiElement,
    uuiMarkers,
    UuiContext,
    isChildHasClass,
} from '@epam/uui-core';

export interface ButtonBaseProps extends ButtonBaseCoreProps, IHasForwardedRef<HTMLButtonElement | HTMLAnchorElement> {}

export const uuiInputElements = [
    uuiElement.checkbox, uuiElement.inputLabel, uuiElement.radioInput, uuiElement.switchBody,
];

export abstract class ButtonBase<ButtonProps extends ButtonBaseProps> extends React.Component<ButtonProps> {
    static contextType = UuiContext;
    context: UuiContexts;
    clickHandler = (e: any) => {
        if (!isClickableChildClicked(e) && !this.props.isDisabled) {
            if (this.props.onClick) {
                this.props.onClick(e);
            }

            if (this.hasLink(this.props.link)) {
                if (this.props.target || (e.button && e.button !== 0) || (e.keyCode && e.keyCode !== 32) || e.ctrlKey || e.metaKey) {
                    e.stopPropagation();
                    return;
                }

                e.preventDefault();
                this.context.uuiRouter.redirect(this.props.link);
            }

            this.context.uuiAnalytics.sendEvent(this.props.clickAnalyticsEvent);
        } else if (
            // NOTE: this condition it necessary here because native input elements (checkbox and radio) do not work correctly inside link
            // https://github.com/facebook/react/issues/9023
            !isChildHasClass(e.target, e.currentTarget, uuiInputElements)
        ) {
            e.preventDefault();
        }
    };

    getClassName?(): string[];
    getChildren?(): React.ReactNode {
        return null;
    }

    getTabIndex(): number {
        if (!this.props.tabIndex && (this.props.isDisabled || (!this.props.onClick && !this.props.link && !this.props.href))) {
            return -1;
        }

        return this.props.tabIndex || 0;
    }

    hasLink(link: ButtonProps['link']): link is NonNullable<ButtonProps['link']> {
        return !!link;
    }

    render(): any {
        let isAnchor = false;
        let isLinkActive = null;
        let href: string | null = null;

        if (this.hasLink(this.props.link)) {
            isAnchor = true;
            href = this.context.uuiRouter?.createHref(this.props.link);
            isLinkActive = this.context.uuiRouter?.isActive(this.props.link);
        } else if (this.props.href) {
            isAnchor = true;
            href = this.props.href;
        }

        const className = cx(
            this.getClassName(),
            uuiElement.buttonBox,
            this.props.isDisabled && uuiMod.disabled,
            !this.props.isDisabled && uuiMod.enabled,
            (this.props.isLinkActive !== undefined ? this.props.isLinkActive : isLinkActive) && uuiMod.active,
            (this.props.onClick || isAnchor) && uuiMarkers.clickable,
            this.props.cx,
        );

        const commonProps = {
            className,
            onClick: this.clickHandler,
            tabIndex: this.getTabIndex(),
            ref: this.props.forwardedRef,
            'aria-disabled': this.props.isDisabled,
            // NOTE: do not use disabled attribute for button because it will prevent all events and broke Tooltip at least
            // more info: https://github.com/epam/UUI/issues/1057#issuecomment-1508632942
            // disabled: this.props.isDisabled,
            ...this.props.rawProps,
        };

        if (isAnchor) {
            const { target } = this.props;
            const relProp = target === '_blank' ? { rel: 'noopener noreferrer' } : {};

            return React.createElement('a', {
                role: 'link', href, target, ...relProp, ...commonProps,
            }, this.getChildren());
        }

        return React.createElement('button', { type: 'button', ...commonProps }, this.getChildren());
    }
}

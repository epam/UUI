import * as React from 'react';
import { cx, ButtonBaseCoreProps, UuiContexts, isClickableChildClicked, uuiMod, uuiElement, uuiMarkers, UuiContext, isChildHasClass, IHasRawProps } from '@epam/uui';

export interface ButtonBaseProps extends ButtonBaseCoreProps, IHasRawProps<HTMLAnchorElement | HTMLButtonElement> {}

export const uuiInputElements = [uuiElement.checkbox, uuiElement.inputLabel, uuiElement.radioInput, uuiElement.switchBody];

export abstract class ButtonBase<ButtonProps extends ButtonBaseProps> extends React.Component<ButtonProps> {
    static contextType = UuiContext;
    context: UuiContexts;

    clickHandler = (e: any) => {
        if (!isClickableChildClicked(e) && !this.props.isDisabled) {
            if (this.props.onClick) {
                this.props.onClick(e);
            }

            if (this.hasLink(this.props.link)) {
                if (this.props.target || (e.button && e.button !== 0) || (e.keyCode && e.keyCode !== 32)) {
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
            !(isChildHasClass(e.target, e.currentTarget, uuiInputElements))
        ) {
            e.preventDefault();
        }
    }

    getClassName?(): string[];

    getChildren?(): React.ReactNode {
        return null;
    }

    getTabIndex(): number {
        if (!this.props.tabIndex && (this.props.isDisabled || !this.props.onClick)) {
            return -1;
        }

        return this.props.tabIndex || 0;
    }

    hasLink(link: ButtonProps['link']): link is NonNullable<ButtonProps['link']> {
        return !!link;
    }

    render() {
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

        return React.createElement(isAnchor ? 'a' : 'button', {
            className: cx(
                this.getClassName(),
                uuiElement.buttonBox,
                this.props.isDisabled && uuiMod.disabled,
                !this.props.isDisabled && uuiMod.enabled,
                (this.props.isLinkActive !== undefined ? this.props.isLinkActive : isLinkActive) && uuiMod.active,
                (this.props.onClick || isAnchor) && uuiMarkers.clickable,
                this.props.cx,
            ),
            role: isAnchor ? 'link' : 'button',
            onClick: this.clickHandler,
            tabIndex: this.getTabIndex(),
            href,
            target: this.props.target,
            'aria-disabled': this.props.isDisabled as IHasRawProps<HTMLAnchorElement | HTMLButtonElement>['rawProps']['aria-disabled'],
            ...this.props.rawProps,
        },
            this.getChildren(),
        );
    }
}
import * as React from 'react';
import cx from 'classnames';
import { ButtonBaseCoreProps, UuiContexts, uuiContextTypes, isClickableChildClicked, uuiMod, uuiElement, uuiMarkers } from '@epam/uui';

export interface ButtonBaseProps extends ButtonBaseCoreProps {
}

export class ButtonBase<ButtonProps extends ButtonBaseProps> extends React.Component<ButtonProps, any> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.keyCode === 32) {
            this.clickHandler(e);
        }
    }

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
        } else {
            e.preventDefault();
        }
    }

    getClassName(): any {
        return null;
    }

    getChildren(): any {
        return null;
    }

    getTabIndex(): number {
        if (this.props.isDisabled) {
            return null;
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

        return React.createElement(isAnchor ? 'a' : 'div', {
            className: cx(
                    this.getClassName(),
                    uuiElement.buttonBox,
                    this.props.isDisabled && uuiMod.disabled,
                    !this.props.isDisabled && uuiMod.enabled,
                    (this.props.isLinkActive !== undefined ? this.props.isLinkActive : isLinkActive) && uuiMod.active,
                    (this.props.onClick || isAnchor) && uuiMarkers.clickable,
                    this.props.cx,
                ),
            onClick: this.clickHandler,
            tabIndex: this.getTabIndex(),
            href,
            target: this.props.target,
            onKeyDown: this.handleKeyDown,
        },
            this.getChildren(),
        );
    }
}
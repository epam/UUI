import * as React from 'react';
import * as css from './Anchor.scss';
import {isClickableChildClicked, handleSpaceKey, uuiMod, uuiElement, uuiMarkers, IHasRawProps} from '@epam/uui';
import cx from 'classnames';
import {
    IHasCX,
    ICanRedirect,
    IHasChildren,
    uuiContextTypes,
    UuiContexts,
    IDisableable,
    IClickable,
} from '@epam/uui';
import { ButtonBase } from "../buttons";

export interface AnchorProps extends IHasCX, ICanRedirect, IHasChildren, IDisableable, IClickable, IHasRawProps<React.HTMLAttributes<HTMLElement>> {

}

export class Anchor extends ButtonBase<AnchorProps> {
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        !this.props.isDisabled && handleSpaceKey(e, this.clickHandler);
    }

    render() {
        let isActive = false;
        let href: string;

        if (this.props.link) {
            isActive = this.context.uuiRouter?.isActive(this.props.link);
            href = this.context.uuiRouter?.createHref(this.props.link);
        } else if (this.props.href) {
            href = this.props.href;
        }
        return React.createElement('a', {
            className: cx(
                css.container,
                uuiElement.anchor,
                this.props.isDisabled ? uuiMod.disabled : uuiMod.enabled,
                (this.props.isLinkActive || isActive) && uuiMod.active,
                uuiMarkers.clickable,
                this.props.cx,
            ),
            tabIndex: 0,
            href,
            target: this.props.target,
            onClick: this.clickHandler,
            onKeyDown: this.handleKeyDown,
            ...(this.props.rawProps as any),
        }, this.props.children);
    }
}
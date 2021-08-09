import * as React from 'react';
import * as css from './Anchor.scss';
import { handleSpaceKey, uuiMod, uuiElement, uuiMarkers, IHasRawProps, UuiContext } from '@epam/uui';
import { ButtonBase } from '../buttons';
import {
    IHasCX,
    ICanRedirect,
    IHasChildren,
    UuiContexts,
    IDisableable,
    IClickable,
    cx,
} from '@epam/uui';

export interface AnchorProps extends IHasCX, ICanRedirect, IHasChildren, IDisableable, IClickable, IHasRawProps<HTMLElement> {}

export class Anchor extends ButtonBase<AnchorProps> {
    static contextType = UuiContext;
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
                this.props.cx
            ),
            tabIndex: 0,
            href,
            role: 'link',
            target: this.props.target,
            onClick: this.clickHandler,
            onKeyDown: this.handleKeyDown,
            'aria-current': this.props.isLinkActive,
            ...this.props.rawProps,
        }, this.props.children);
    }
}
import React from 'react';
import { handleSpaceKey, uuiMod, uuiElement, uuiMarkers, UuiContext, IHasForwardedRef, IHasChildren, UuiContexts,
    cx, ButtonComponentProps,
} from '@epam/uui-core';
import { ButtonBase } from '../buttons';
import css from './Anchor.module.scss';

export type AnchorProps = ButtonComponentProps & IHasChildren & IHasForwardedRef<HTMLAnchorElement | HTMLButtonElement> & {};

export class AnchorImpl extends ButtonBase<AnchorProps> {
    static contextType = UuiContext;
    context: UuiContexts;
    handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        !this.props.isDisabled && handleSpaceKey(e, this.clickHandler);
    };

    render() {
        const { isLinkActive, href } = this.getAnchorParams();

        const { target } = this.props;
        const relProp = target === '_blank' ? { rel: 'noopener noreferrer' } : {};

        return React.createElement(
            'a',
            {
                className: cx(
                    css.container,
                    uuiElement.anchor,
                    this.props.isDisabled ? uuiMod.disabled : uuiMod.enabled,
                    (this.props.isLinkActive ?? isLinkActive) && uuiMod.active,
                    uuiMarkers.clickable,
                    this.props.cx,
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
            this.props.children,
        );
    }
}

export const Anchor = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, AnchorProps>((props, ref) => <AnchorImpl { ...props } forwardedRef={ ref } />);

Anchor.displayName = 'Anchor';

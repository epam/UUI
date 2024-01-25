import React from 'react';
import { IAnalyticableClick, ICanRedirect, IClickable, IDisableable, IHasChildren, IHasCX, IHasTabIndex } from '@epam/uui-core';
import { AnchorNavigationProps, Clickable, HrefNavigationProps, LinkButtonNavigationProps } from '../widgets';
import css from './Anchor.module.scss';

export type UnionAnchorNavigationProps = HrefNavigationProps | LinkButtonNavigationProps | AnchorNavigationProps;

export type AnchorRawProps =
    | (React.AnchorHTMLAttributes<HTMLAnchorElement>
    | React.ButtonHTMLAttributes<HTMLButtonElement>)
    & Record<`data-${string}`, string>;

export type AnchorProps = IClickable & IAnalyticableClick & IHasTabIndex & IDisableable & IHasCX
& ICanRedirect & UnionAnchorNavigationProps & IHasChildren & {
    /** Any HTML attributes (native or 'data-') to put on the underlying component */
    rawProps?: AnchorRawProps;
};

export const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>((props, ref) => {
    return (
        <Clickable
            { ...props }
            href={ props.href || '#' }
            cx={ [css.container, props.cx] }
            ref={ ref }
        />
    );
});

Anchor.displayName = 'Anchor';

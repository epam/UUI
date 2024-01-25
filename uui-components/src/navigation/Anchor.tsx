import React from 'react';
import { IAnalyticableClick, ICanRedirect, IClickable, IDisableable, IHasChildren, IHasCX, IHasTabIndex, IHasRawProps } from '@epam/uui-core';
import { Clickable } from '../widgets';
import css from './Anchor.module.scss';

type AnchorRawProps = React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement>;

export type AnchorProps = IClickable & IAnalyticableClick & IHasTabIndex & IDisableable & IHasCX
& ICanRedirect & IHasChildren & IHasRawProps<AnchorRawProps> & {};

export const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>((props, ref) => {
    return (
        <Clickable
            { ...props }
            clickableType="anchor"
            cx={ [css.container, props.cx] }
            ref={ ref }
        />
    );
});

Anchor.displayName = 'Anchor';

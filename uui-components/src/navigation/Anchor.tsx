import React from 'react';
import { IHasChildren } from '@epam/uui-core';
import { Clickable, ClickableComponentProps } from '../widgets';
import css from './Anchor.module.scss';

export type AnchorProps = ClickableComponentProps & IHasChildren & {};

export const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>((props, ref) => {
    return (
        <Clickable
            { ...props }
            type="anchor"
            cx={ [css.container, props.cx] }
            ref={ ref }
        />
    );
});

import React from 'react';
import { IHasChildren } from '@epam/uui-core';
import { Clickable, ClickableComponentProps } from '../widgets';
import css from './Anchor.module.scss';

export type AnchorProps = ClickableComponentProps & IHasChildren & React.RefAttributes<HTMLAnchorElement> & {};

export function Anchor(props: AnchorProps) {
    return (
        <Clickable
            { ...props }
            type="anchor"
            cx={ [css.container, props.cx] }
            ref={ props.ref }
        />
    );
}

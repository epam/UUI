import * as React from 'react';
import { IDropdownToggler, Icon, IClickable, IAnalyticableClick, IHasTabIndex, IDisableable, IHasCX, ICanRedirect, IHasRawProps } from '@epam/uui-core';
import { Clickable } from '../widgets';
import { IconContainer } from '../layout';
import css from './IconButton.module.scss';

type IconButtonRawProps = React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement>;

export type IconButtonProps = IClickable & IAnalyticableClick & IHasTabIndex & IDisableable & IHasCX
& ICanRedirect & IDropdownToggler & IHasRawProps<IconButtonRawProps> & {
    /** Icon can be a React element (usually an SVG element) */
    icon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
};

export const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>((props, ref) => {
    return (
        <Clickable
            { ...props }
            clickableType="button"
            cx={ [css.container, props.cx] }
            ref={ ref }
        >
            <IconContainer icon={ props.icon } />
        </Clickable>
    );
});

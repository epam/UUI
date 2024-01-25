import * as React from 'react';
import { IDropdownToggler, Icon, IClickable, IAnalyticableClick, IHasTabIndex, IDisableable, IHasCX, ICanRedirect, IHasRawProps } from '@epam/uui-core';
import { AnchorNavigationProps, ButtonNavigationProps, Clickable, HrefNavigationProps, LinkButtonNavigationProps } from '../widgets';
import { IconContainer } from '../layout';
import css from './IconButton.module.scss';

export type UnionIconButtonNavigationProps = HrefNavigationProps | LinkButtonNavigationProps | ButtonNavigationProps | AnchorNavigationProps;

export type IconButtonRawProps = React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement>;

export type IconButtonProps = IClickable & IAnalyticableClick & IHasTabIndex & IDisableable & IHasCX
& Omit<ICanRedirect, 'href' | 'link'> & IDropdownToggler & UnionIconButtonNavigationProps & IHasRawProps<IconButtonRawProps> & {
    /** Icon can be a React element (usually an SVG element) */
    icon?: Icon;
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;
};

export const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>((props, ref) => {
    return (
        <Clickable
            { ...props }
            cx={ [css.container, props.cx] }
            ref={ ref }
            rawProps={ {
                type: props.rawProps?.type || 'button',
                ...props.rawProps,
            } }
        >
            <IconContainer icon={ props.icon } />
        </Clickable>
    );
});

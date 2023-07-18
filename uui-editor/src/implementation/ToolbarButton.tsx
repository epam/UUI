import * as React from 'react';
import { Editor } from "slate";
import { Button } from '@epam/uui-components';
import css from './ToolbarButton.module.scss';
import { Icon, IHasCX, cx } from '@epam/uui-core';

export interface ToolbarButtonProps extends IHasCX {
    isActive?: boolean;
    onClick?: () => any;
    icon?: Icon;
    iconColor?: 'red' | 'green' | 'amber' | 'blue' | 'gray60';
    editor?: Editor;
    isDisabled?: boolean;
    caption?: string;
}

export const ToolbarButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ToolbarButtonProps>((props, ref) => (
    <Button
        onClick={ (e) => {
            e.preventDefault();
            props.onClick();
        } }
        icon={ props.icon }
        caption={ props.caption }
        forwardedRef={ ref }
        cx={ cx(css.toolbarButton, css['color-' + props.iconColor], css[props.isActive ? 'gray90' : 'gray80'], props.cx) }
        isDisabled={ props.isDisabled }
    />
));

import * as React from 'react';
import { Editor } from 'slate-react';
import { Button } from '@epam/uui-components';
import css from './ToolbarButton.scss';
import { Icon, cx } from '@epam/uui-core';

export interface ToolbarButtonProps {
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
        onClick={e => {
            e.preventDefault();
            props.onClick();
        }}
        icon={props.icon}
        caption={props.caption}
        forwardedRef={ref}
        cx={cx(css.toolbarButton, css['color-' + props.iconColor], css[props.isActive ? 'gray90' : 'gray80'])}
        isDisabled={props.isDisabled}
    />
));

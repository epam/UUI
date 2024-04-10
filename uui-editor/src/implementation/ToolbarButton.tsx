import * as React from 'react';
import { Editor } from 'slate';
import { IHasCX, Icon, cx, IHasCaption, IDisableable } from '@epam/uui-core';
import { Button } from '@epam/uui-components';

import css from './ToolbarButton.module.scss';

interface ToolbarButtonProps extends IHasCX, IHasCaption, IDisableable {
    isActive?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    icon?: Icon;
    iconColor?: 'red' | 'green' | 'amber' | 'blue' | 'gray60';
    editor?: Editor;
}

export const ToolbarButton = /* @__PURE__ */React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ToolbarButtonProps>((props, ref) => (
    <Button
        onClick={ (e) => {
            props.onClick(e);
        } }
        icon={ props.icon }
        caption={ props.caption }
        ref={ ref }
        cx={ cx(css.toolbarButton, css['color-' + props.iconColor], css[props.isActive ? 'gray90' : 'gray80'], props.cx) }
        isDisabled={ props.isDisabled }
    />
));

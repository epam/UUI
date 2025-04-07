import * as React from 'react';
import { IHasCX, Icon, cx, IHasCaption, IDisableable, IHasRawProps } from '@epam/uui-core';
import { Button, ClickableRawProps } from '@epam/uui-components';

import css from './ToolbarButton.module.scss';

interface ToolbarButtonProps extends IHasCX, IHasCaption, IDisableable, IHasRawProps<ClickableRawProps>, React.RefAttributes<HTMLButtonElement | HTMLAnchorElement> {
    isActive?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    icon?: Icon;
}

export function ToolbarButton(props: ToolbarButtonProps) {
    return (
        <Button
            ref={ props.ref }
            rawProps={ props.rawProps }
            cx={ cx(css.toolbarButton, css[props.isActive ? 'gray90' : 'gray80'], props.cx) }
            icon={ props.icon }
            caption={ props.caption }
            onClick={ props.onClick }
            isDisabled={ props.isDisabled }
        />
    );
}

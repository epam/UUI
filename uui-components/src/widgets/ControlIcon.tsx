import { cx, IHasRawProps, uuiMarkers } from '@epam/uui-core';
import React from 'react';
import { IconButton, IconButtonProps } from '../buttons';
import { IconContainer } from '../layout/IconContainer';
import css from './ControlIcon.module.scss';

type ControlIconProps = Pick<IconButtonProps, 'cx' | 'icon' | 'isDisabled' | 'onClick' | 'rotate' | 'size' | 'tabIndex'>
& IHasRawProps<React.HTMLAttributes<HTMLDivElement> | React.ButtonHTMLAttributes<HTMLButtonElement>> & {
    /** Called when keyDown event is fired on component */
    onKeyDown?: (e: React.KeyboardEvent) => void;
};

export function ControlIcon(props: ControlIconProps): React.ReactNode {
    const isFocusable = !props.isDisabled && (props.onClick || props.onKeyDown);

    if (!isFocusable) {
        // No point in rendering the container, if there is nothing in it.
        if (!props.icon) {
            return null;
        }

        return (
            <IconContainer
                { ...props }
                rawProps={ props.rawProps as IHasRawProps<React.HTMLAttributes<HTMLDivElement>> }
                cx={ cx(css.controlIcon, props.cx) }
            />
        );
    }

    return (
        <IconButton
            { ...props }
            cx={ cx(css.controlIcon, props.cx, isFocusable && uuiMarkers.focusable) }
        />
    );
}

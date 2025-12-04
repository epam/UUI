import { cx, IHasRawProps, uuiMarkers, uuiMod } from '@epam/uui-core';
import React from 'react';
import { IconButton, IconButtonProps } from '../buttons';
import { IconContainer } from '../layout/IconContainer';
import css from './ControlIcon.module.scss';

type ControlIconProps = Pick<IconButtonProps, 'cx' | 'icon' | 'isDisabled' | 'onClick' | 'rotate' | 'size' | 'tabIndex' | 'flipY'>
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
                cx={ cx('uui-control_icon', props.isDisabled && uuiMod.disabled, props.cx) }
            />
        );
    }

    return (
        <IconButton
            { ...props }
            cx={ cx('uui-control_icon', css.root, props.cx, props.isDisabled && uuiMod.disabled, isFocusable && uuiMarkers.focusable) }
        />
    );
}

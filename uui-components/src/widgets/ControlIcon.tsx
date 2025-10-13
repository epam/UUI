import React from 'react';
import {
    cx,
    IAnalyticableClick,
    IClickable,
    Icon,
    IDisableable,
    IHasCX,
    IHasRawProps,
    IHasTabIndex,
    uuiElement,
    uuiMarkers,
    uuiMod,
} from '@epam/uui-core';
import { Svg } from './Svg';
import css from './ControlIcon.module.scss';

interface ControlIconProps extends IClickable, IAnalyticableClick, IHasTabIndex, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasCX, IDisableable {
    /** Flips the icon vertically */
    flipY?: boolean;
    /** Icon can be a React element (usually an SVG element) */
    icon?: Icon;
    /**  */
    onKeyDown?: (e: React.KeyboardEvent) => void;
    /** Focus handler. To enable focus, remember to pass tabIndex. */
    onFocus?(e: React.FocusEvent<HTMLDivElement>): void;
    /** Blur handler. To enable blur, remember to pass tabIndex. */
    onBlur?(e: React.FocusEvent<HTMLDivElement>): void;
    /** Rotate the icon (cw stands for 'clock-wise', ccw stands for 'counter clock-wise')) */
    rotate?: '0' | '90cw' | '180' | '90ccw';
    /** Icon size in pixels (both width and height, as icons are assumed to be square-shaped) */
    size?: number | string;
    /** Accessible label for the control icon button */
    ariaLabel?: string;
}

export const ControlIcon = React.forwardRef<HTMLDivElement, ControlIconProps>((props, ref) => {
    const isClickable = !props.isDisabled && (props.onClick || props.onKeyDown);
    const isFocusable = !props.isDisabled && (props.onClick || props.onKeyDown || props.onFocus || props.onBlur);

    return (
        <div
            className={ cx(
                css.root,
                uuiElement.icon,
                props.isDisabled ? uuiMod.disabled : uuiMod.enabled,
                isClickable && uuiMarkers.clickable,
                props.cx,
            ) }
            ref={ ref }
            onClick={ isClickable ? props.onClick : undefined }
            onKeyDown={ props.onKeyDown }
            onFocus={ props.onFocus }
            onBlur={ props.onBlur }
            tabIndex={ isFocusable ? props.tabIndex : undefined }
            { ...props.rawProps }
            aria-label={ props.ariaLabel }
        >
            <Svg
                svg={ props.icon }
                width={ props.size }
                height={ props.size }
                cx={ cx(props.flipY && css.flipY, props.rotate && css['rotate-' + props.rotate]) }
                rawProps={ {
                    'aria-hidden': true,
                    focusable: false,
                } }
            />
        </div>
    );
});

import * as React from 'react';
import css from './IconContainer.module.scss';
import {
    uuiElement, uuiMod, uuiMarkers, IHasCX, IDisableable, Icon, cx, IHasRawProps, IHasTabIndex,
} from '@epam/uui-core';
import { Svg } from '../widgets/Svg';

export interface ControlIconProps extends IHasCX, IDisableable, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasTabIndex {
    /** Icon to display */
    icon?: Icon;
    /** Flips the icon vertically */
    flipY?: boolean;
    /** Rotate the icon (cw stands for 'clock-wise', ccw stands for 'counter clock-wise)) */
    rotate?: '0' | '90cw' | '180' | '90ccw';
    /** Click handler */
    onClick?(e: React.SyntheticEvent<HTMLDivElement>): void;
    /** Focus handler. To enable focus, remember to pass tabIndex. */
    onFocus?(e: React.FocusEvent<HTMLDivElement>): void;
    /** Blur handler. To enable blur, remember to pass tabIndex. */
    onBlur?(e: React.FocusEvent<HTMLDivElement>): void;
    /** CSS style prop to put on the component */
    style?: React.CSSProperties;
    /** Icon size in pixels (both width and height, as icons are assumed to be square-shaped) */
    size?: number | string;
}

/** Represents the properties of a IconContainer component. */
export type IconContainerProps = ControlIconProps & {};

export const IconContainer = React.forwardRef<HTMLDivElement, ControlIconProps>((props, ref) => {
    const isClickable = !props.isDisabled && props.onClick;
    const isFocusable = !props.isDisabled && (props.onClick || props.onFocus || props.onBlur);

    return (
        <div
            className={ cx(
                css.container,
                uuiElement.icon,
                props.isDisabled ? uuiMod.disabled : uuiMod.enabled,
                isClickable && uuiMarkers.clickable,
                props.cx,
                props.rawProps?.className,
            ) }
            ref={ ref }
            onClick={ isClickable ? props.onClick : undefined }
            onFocus={ props.onFocus }
            onBlur={ props.onBlur }
            tabIndex={ isFocusable ? props.tabIndex : undefined }
            style={ { ...props.style, ...props.rawProps?.style } }
            { ...props.rawProps }
        >
            <Svg svg={ props.icon } width={ props.size } height={ props.size } cx={ cx(props.flipY && css.flipY, props.rotate && css['rotate-' + props.rotate]) } />
        </div>
    );
});

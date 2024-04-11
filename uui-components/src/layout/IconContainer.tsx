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
    /** CSS style prop to put on the component */
    style?: React.CSSProperties;
    /** Icon size in pixels (both width and height, as icons are assumed to be square-shaped) */
    size?: number;
}

export const IconContainer = /* @__PURE__ */React.forwardRef<HTMLDivElement, ControlIconProps>((props, ref) => {
    const isClickable = !props.isDisabled && props.onClick;

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
            tabIndex={ isClickable ? props.tabIndex : undefined }
            style={ { ...props.style, ...props.rawProps?.style } }
            { ...props.rawProps }
        >
            <Svg svg={ props.icon } width={ props.size } height={ props.size } cx={ cx(props.flipY && css.flipY, props.rotate && css['rotate-' + props.rotate]) } />
        </div>
    );
});

IconContainer.displayName = 'IconContainer';

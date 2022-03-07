import * as React from 'react';
import * as css from './IconContainer.scss';
import { uuiElement, uuiMod, uuiMarkers, IHasCX, IDisableable, Icon, cx, IHasRawProps } from '@epam/uui-core';
import { Svg } from '../widgets';

export interface ControlIconProps extends IHasCX, IDisableable, IHasRawProps<HTMLDivElement> {
    icon?: Icon;
    flipY?: boolean;
    rotate?: '0' | '90cw' | '180' | '90ccw';
    onClick?(e: React.SyntheticEvent<HTMLDivElement>): void;
    tabIndex?: number;
    style?: React.CSSProperties;
    size?: number;
}

export const IconContainer = React.forwardRef<HTMLDivElement, ControlIconProps>((props, ref) => {
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
            <Svg svg={ props.icon } width={ props.size } height={ props.size } cx={ cx(props.flipY && css.flipY, props.rotate && css['rotate-' + props.rotate]) }/>
        </div>
    );
});
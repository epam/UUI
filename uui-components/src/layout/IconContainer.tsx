import * as React from 'react';
import cx from 'classnames';
import * as css from './IconContainer.scss';
import { uuiElement, uuiMod, uuiMarkers, IHasCX, IDisableable, Icon } from '@epam/uui';
import { Svg } from '../widgets';

export interface ControlIconProps extends IHasCX, IDisableable {
    icon?: Icon;
    flipY?: boolean;
    rotate?: '0' | '90cw' | '180' | '90ccw';
    onClick?(e: React.SyntheticEvent<HTMLDivElement>): void;
    tabIndex?: number;
    style?: React.CSSProperties;
    size?: number;
}

export const IconContainer = (props: ControlIconProps) => {
    const isClickable = !props.isDisabled && props.onClick;

    return (
        <div
            className={ cx(
                css.container,
                uuiElement.icon,
                props.isDisabled ? uuiMod.disabled : uuiMod.enabled,
                isClickable && uuiMarkers.clickable,
                props.cx,
            ) }
            onClick={ isClickable ? props.onClick : undefined }
            tabIndex={ props.tabIndex }
            style={ props.style }
        >
            <Svg svg={ props.icon } width={ props.size } height={ props.size } cx={ cx(props.flipY && css.flipY, props.rotate && css['rotate-' + props.rotate]) }/>
        </div>
    );
};
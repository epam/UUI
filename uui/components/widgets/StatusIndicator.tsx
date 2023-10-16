import React, { forwardRef } from 'react';
import cx from 'classnames';
import { IHasCX } from '@epam/uui-core';
import css from './StatusIndicator.module.scss';

export interface StatusIndicatorProps extends IHasCX {
    size?: '24' | '18' | '12';
    color?: 'neutral' | 'white' | 'info' | 'success' | 'warning' | 'critical';
    fill?: 'contrast' | 'bright' | 'outline';
}

export const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>((props, ref) => {
    return (
        <div
            ref={ ref }
            className={ cx([
                css.root,
                css[`size-${props.size || 24}`],
                'uui-status_indicator',
                `uui-color-${props.color || 'neutral'}`,
                `fill-${props.fill || 'contrast'}`,
                props.cx,
            ]) }
        >
        </div>
    );
});

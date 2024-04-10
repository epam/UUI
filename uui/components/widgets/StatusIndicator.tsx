import React, { forwardRef } from 'react';
import cx from 'classnames';
import { IHasCX } from '@epam/uui-core';
import css from './StatusIndicator.module.scss';

type StatusIndicatorColor = 'neutral' | 'info' | 'success' | 'warning' | 'critical';

type StatusIndicatorMods = {
    /**
     * Component color.
     * @default 'neutral'
     */
    color?: StatusIndicatorColor;
};

export type StatusIndicatorCoreProps = IHasCX & {
    /**
     * Component size. If omitted, 24 size will be used.
     * @default '24'
     */
    size?: '24' | '18' | '12';
    /**
     * Fill mode, solid is used by default
     * @default 'solid'
     */
    fill?: 'solid' | 'outline';
    /** Component caption. */
    caption: string;
};

export type StatusIndicatorProps = StatusIndicatorCoreProps & StatusIndicatorMods;

export const StatusIndicator = /* @__PURE__ */forwardRef<HTMLDivElement, StatusIndicatorProps>((props, ref) => {
    return (
        <div
            ref={ ref }
            className={ cx([
                css.root,
                css[`size-${props.size || 24}`],
                'uui-status_indicator',
                `uui-color-${props.color || 'neutral'}`,
                `uui-fill-${props.fill || 'solid'}`,
                props.cx,
            ]) }
        >
            <div className="uui-status_indicator_dot"></div>
            <p className="uui-status_indicator_caption">{props.caption}</p>
        </div>
    );
});

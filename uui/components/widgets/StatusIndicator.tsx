import React, { forwardRef } from 'react';
import cx from 'classnames';
import type { IHasCX, Overwrite } from '@epam/uui-core';
import { settings } from '../../settings';

import css from './StatusIndicator.module.scss';

type StatusIndicatorColor = 'neutral' | 'info' | 'success' | 'warning' | 'critical';

type StatusIndicatorMods = {
    /**
     * Component color.
     * @default 'neutral'
     */
    color?: StatusIndicatorColor;
};

export interface StatusIndicatorModsOverride {}

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

export type StatusIndicatorProps = StatusIndicatorCoreProps & Overwrite<StatusIndicatorMods, StatusIndicatorModsOverride>;

export const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>((props, ref) => {
    return (
        <div
            ref={ ref }
            className={ cx([
                css.root,
                `uui-size-${props.size || settings.statusIndicator.sizes.default}`,
                'uui-status_indicator',
                `uui-color-${props.color || 'neutral'}`,
                `uui-fill-${props.fill || 'solid'}`,
                props.cx,
            ]) }
        >
            <div className="uui-status_indicator-dot"></div>
            <p className="uui-status_indicator-caption">{props.caption}</p>
        </div>
    );
});

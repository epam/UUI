import React, { forwardRef } from 'react';
import cx from 'classnames';
import type { IHasCaption, IHasCX, Overwrite } from '@epam/uui-core';
import { settings } from '../../settings';

import css from './CountIndicator.module.scss';

type CountIndicatorMods = {
    /**
     * Defines component color.
     */
    color: 'neutral' | 'white' | 'info' | 'success' | 'warning' | 'critical';
    /**
     * Defines component size.
     * @default '24'
     */
    size?: '12' | '18' | '24';
};

export interface CountIndicatorModsOverride {}

export type CountIndicatorCoreProps = IHasCaption & IHasCX;

export type CountIndicatorProps = CountIndicatorCoreProps & Overwrite<CountIndicatorMods, CountIndicatorModsOverride>;

export const CountIndicator = forwardRef<HTMLDivElement, CountIndicatorProps>((props, ref) => {
    return (
        <div
            ref={ ref }
            className={ cx([
                css.root,
                'uui-count_indicator',
                `uui-size-${props.size || settings.countIndicator.sizes.default}`,
                props.color && `uui-color-${props.color}`,
                props.cx,
            ]) }
        >
            { props.caption }
        </div>
    );
});

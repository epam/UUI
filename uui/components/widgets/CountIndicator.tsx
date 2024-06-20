import React, { forwardRef } from 'react';
import cx from 'classnames';
import { IHasCaption, IHasCX } from '@epam/uui-core';
import { settings } from '../../settings';
import css from './CountIndicator.module.scss';

type CountIndicatorMods = {
    /**
     * Defines component color.
     */
    color: 'neutral' | 'white' | 'info' | 'success' | 'warning' | 'critical';
};

export type CountIndicatorCoreProps = IHasCaption & IHasCX & {
    /**
     * Defines component size.
     * @default '24'
     */
    size?: '24' | '18' | '12';
};

export type CountIndicatorProps = CountIndicatorCoreProps & CountIndicatorMods;

export const CountIndicator = forwardRef<HTMLDivElement, CountIndicatorProps>((props, ref) => {
    return (
        <div
            ref={ ref }
            className={ cx([
                css.root,
                'uui-count_indicator',
                `uui-size-${props.size || settings.sizes.defaults.countIndicator}`,
                props.color && `uui-color-${props.color}`,
                props.cx,
            ]) }
        >
            { props.caption }
        </div>
    );
});

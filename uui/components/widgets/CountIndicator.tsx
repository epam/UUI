import React, { forwardRef } from 'react';
import cx from 'classnames';
import { IHasCaption, IHasCX } from '@epam/uui-core';
import css from './CountIndicator.module.scss';

export type CountIndicatorMods = {
    /** Property is required */
    color: 'neutral' | 'white' | 'info' | 'success' | 'warning' | 'critical' | null;
};

export type CountIndicatorCoreProps = IHasCaption & IHasCX & {
    /**
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
                css[`size-${props.size || 24}`],
                props.color && `uui-color-${props.color}`,
                props.cx,
            ]) }
        >
            { props.caption }
        </div>
    );
});

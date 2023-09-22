import React, { forwardRef } from 'react';
import cx from 'classnames';
import { IHasCaption, IHasCX } from '@epam/uui-core';
import css from './CountIndicator.module.scss';

export interface CountIndicatorProps extends IHasCaption, IHasCX {
    size?: '24' | '18' | '12';
    color: 'neutral' | 'white' | 'info' | 'success' | 'warning' | 'critical' | null;
}

export const CountIndicator = forwardRef<HTMLDivElement, CountIndicatorProps>((props, ref) => {
    return (
        <div
            ref={ ref }
            className={ cx([
                css.root,
                'uui-count_indicator',
                `size-${props.size || 24}`,
                props.color && `uui-color-${props.color}`,
                props.cx,
            ]) }
        >
            { props.caption }
        </div>
    );
});

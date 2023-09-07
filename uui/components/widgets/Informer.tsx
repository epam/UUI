import React, { forwardRef } from 'react';
import cx from 'classnames';
import { IHasCaption } from '@epam/uui-core';
import css from './Informer.module.scss';

export interface InformerProps extends IHasCaption {
    size?: '24' | '18' | '12';
    color: 'neutral' | 'white' | 'info' | 'success' | 'warning' | 'negative' | null;
}

export const Informer = forwardRef<HTMLDivElement, InformerProps>((props, ref) => {
    return (
        <div
            ref={ ref }
            className={ cx([
                css.root,
                'uui-informer',
                `size-${props.size || 24}`,
                props.color && `uui-color-${props.color}`,
            ]) }
        >
            { props.caption }
        </div>
    );
});

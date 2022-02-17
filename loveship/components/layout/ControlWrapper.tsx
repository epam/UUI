import * as React from 'react';
import cx from 'classnames';
import { IHasCX, IHasRawProps } from '@epam/uui-core';
import * as types from '../types';
import * as css from './ControlWrapper.scss';

interface ControlWrapperProps extends IHasCX, IHasRawProps<HTMLDivElement> {
    size: types.ControlSize;
    children: React.ReactNode;
}

export const ControlWrapper = React.forwardRef<HTMLDivElement, ControlWrapperProps>((props, ref) => (
    <div
        ref={ ref }
        className={ cx(css.root, css['size-' + props.size], props.cx) }
        { ...props.rawProps }
    >
        { props.children }
    </div>
));
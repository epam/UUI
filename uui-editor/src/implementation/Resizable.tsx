import React, { ComponentProps } from 'react';
import {
    Resizable as ResizablePrimitive,
    ResizeHandle as ResizeHandlePrimitive,
} from '@udecode/plate-resizable';
import cx from 'classnames';
import css from './Resizable.module.scss';

interface ResizeHandleProps extends ComponentProps<typeof ResizeHandlePrimitive> {
}

export function ResizeHandle({ className, ...props }: ResizeHandleProps) {
    const variantClass = {
        right: css.rightHandle,
        left: css.leftHandle,
        top: css.topHandle,
        bottom: css.bottomHandle,
    };

    return (
        <ResizeHandlePrimitive
            className={ cx(
                css.resizeHandle,
                variantClass[props.options!.direction!],
                className,
            ) }
            { ...props }
        />
    );
}

interface ResizableProps extends ComponentProps<typeof ResizablePrimitive> {
    align?: 'left' | 'right' | 'center' | null | undefined;
}

export function Resizable({ className, align, ...props }: ResizableProps) {
    const aligns = [
        align === 'center' && css.alignCenter,
        align === 'left' && css.alignLeft,
        align === 'right' && css.alignRight,
    ];
    return (
        <ResizablePrimitive
            className={ cx(...aligns, className) }
            { ...props }
        />
    );
}

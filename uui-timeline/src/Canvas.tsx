import React, { useRef, useLayoutEffect } from 'react';
import cx from 'classnames';
import { TimelineController } from '../index';
import { TimelineTransform } from './TimelineTransform';
import { useTimelineTransform } from './useTimelineTransform';

export interface CanvasProps {
    canvasHeight?: number;
    className?: string;
    timelineController: TimelineController;
    renderOnTop?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;
    draw?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;
}
export interface CanvasState { 
    width?: number;
}

export function Canvas<TProps extends CanvasProps>({
    timelineController, draw, renderOnTop, canvasHeight, className, ...restProps
}: TProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const alreadyRenderedRef = useRef(false);
    const height = canvasHeight ?? 60;

    const timelineTransform = useTimelineTransform({ timelineController });
    
    const handleRenderCanvas = (t: TimelineTransform) => {
        if (!canvasRef.current) {
            alreadyRenderedRef.current = false;
            return;
        }

        const ctx = canvasRef.current.getContext('2d')!;
        ctx.save();
        ctx.scale(devicePixelRatio, devicePixelRatio);
        draw?.(ctx, t);
        renderOnTop?.(ctx, t);
        ctx.restore();
    };

    useLayoutEffect(() => {
        handleRenderCanvas(timelineTransform);
    });

    return (
        <canvas
            className={ cx(className) }
            style={ { width: timelineTransform.widthPx, height } }
            width={ timelineTransform.widthPx * devicePixelRatio }
            height={ height * devicePixelRatio }
            ref={ canvasRef }
            { ...restProps }
        />
    );
}

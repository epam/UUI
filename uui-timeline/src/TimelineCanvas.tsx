import React, { useRef, useLayoutEffect } from 'react';
import cx from 'classnames';
import { TimelineController } from '../index';
import { TimelineTransform } from './TimelineTransform';
import { useTimelineTransform } from './useTimelineTransform';

/**
 * TimelineCanvas props.
 */
export interface TimelineCanvasProps {
    /**
     * Height of canvas element.
     * @default 60
     */
    canvasHeight?: number;
    /**
     * Canvas element class name.
     */
    className?: string;
    /**
     * Controller of timeline.
     */
    timelineController: TimelineController;
    /**
     * Draw on canvas.
     * @param ctx - canvas rendering context.
     * @param t - current timeline position info.
     */
    draw?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;

    /**
     * Draw on canvas over elements, drawn with the `draw` function.
     * @param ctx - canvas rendering context.
     * @param t - current timeline position info.
     */
    drawOnTop?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;
}

/**
 * Low-level Timeline compatible Canvas component. If some specific element should be drawn on Timeline canvas,
 * current component should be used.
 * @returns canvas element.
 */
export function TimelineCanvas<TProps extends TimelineCanvasProps>({
    timelineController, draw, drawOnTop, canvasHeight, className, ...restProps
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
        drawOnTop?.(ctx, t);
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

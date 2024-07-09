import React, { useRef, useState, useLayoutEffect } from 'react';
import cx from 'classnames';
import { TimelineController } from '../index';
import { TimelineTransform } from './TimelineTransform';
import { useTimelineTransform } from './useTimelineTransform';

export interface CanvasProps {
    canvasHeight?: number;
    className?: string;
    timelineController: TimelineController;
    renderOnTop?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;
    renderCanvas?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;
}
export interface CanvasState { 
    width?: number;
}

export function Canvas<TProps extends CanvasProps>({
    timelineController, renderCanvas, renderOnTop, canvasHeight, className, ...restProps
}: TProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const height = canvasHeight ?? 60;

    const [width, setWidth] = useState(0);
    const timelineTransform = useTimelineTransform({ timelineController });
    
    const handleRenderCanvas = (t: TimelineTransform) => {
        if (!canvasRef.current) {
            return;
        }

        const ctx = canvasRef.current.getContext('2d')!;
        ctx.save();
        ctx.scale(devicePixelRatio, devicePixelRatio);
        renderCanvas(ctx, t);
        renderOnTop?.(ctx, t);
        ctx.restore();
    };

    const handleResize = React.useCallback((t: TimelineTransform) => {
        if (t.widthPx !== width) {
            setWidth(t.widthPx);
        }
    }, [width]);

    useLayoutEffect(() => {
        handleResize(timelineTransform);
        handleRenderCanvas(timelineTransform);
    });

    const currentWidth = width ?? timelineController.currentViewport.widthPx;
    return (
        <canvas
            className={ cx(className) }
            style={ { width: currentWidth, height } }
            width={ currentWidth * devicePixelRatio }
            height={ height * devicePixelRatio }
            ref={ canvasRef }
            { ...restProps }
        />
    );
}

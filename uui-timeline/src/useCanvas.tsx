import React, { useRef, useCallback, useEffect } from 'react';
import cx from 'classnames';
import { TimelineController } from './TimelineController';
import { TimelineTransform } from './TimelineTransform';
import { useForceUpdate } from '@epam/uui-core';

export interface BaseTimelineCanvasComponentProps {
    draw?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void; 
    canvasHeight?: number;
    className?: string;
    timelineController: TimelineController;
    renderOnTop?(ctx: CanvasRenderingContext2D, t: TimelineTransform): void;
}

export function useCanvas(
    props: BaseTimelineCanvasComponentProps,
    deps?: any[],
) {
    const forceUpdate = useForceUpdate();
    const { timelineController, canvasHeight = 60 } = props;
    const canvasRef = useRef(null);

    const handleRenderCanvas = useCallback((t: TimelineTransform) => {
        const ctx = canvasRef.current!.getContext('2d')!;
        ctx.save();
        ctx.scale(devicePixelRatio, devicePixelRatio);
        props?.draw(ctx, t);
        props.renderOnTop?.(ctx, t);
        ctx.restore();
    }, [props?.draw]);

    useEffect(() => {
        timelineController.subscribe(handleRenderCanvas);
        return () => timelineController.unsubscribe(handleRenderCanvas);
    }, [handleRenderCanvas, timelineController]);

    useEffect(() => {
        forceUpdate();
    }, [timelineController.currentViewport.widthPx]);

    useEffect(() => {
        handleRenderCanvas(timelineController.getTransform());
    }, deps ? [...deps] : undefined);

    const renderCanvas = useCallback((canvasProps?: any) => {
        const width = timelineController.currentViewport.widthPx;
        return (
            <canvas
                className={ cx(props.className, props && props.className) }
                style={ { width, height: canvasHeight } }
                width={ width * devicePixelRatio }
                height={ canvasHeight * devicePixelRatio }
                ref={ (c) => {
                    canvasRef.current = c;
                } }
                { ...canvasProps }
            />
        );
    }, [canvasHeight, timelineController.currentViewport.widthPx]);

    return { canvasRef, renderCanvas };
}

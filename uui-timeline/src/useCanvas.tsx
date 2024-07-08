import React, { useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import cx from 'classnames';
import { TimelineController } from './TimelineController';
import { TimelineTransform } from './TimelineTransform';
import { useForceUpdate, usePrevious } from '@epam/uui-core';

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
    const prevWidth = usePrevious(timelineController.currentViewport.widthPx);

    const handleRenderCanvas = useCallback((t: TimelineTransform) => {
        if (!canvasRef.current) {
            return;
        }
        const ctx = canvasRef.current!.getContext('2d')!;
        ctx.save();
        ctx.scale(devicePixelRatio, devicePixelRatio);
        props?.draw(ctx, t);
        props.renderOnTop?.(ctx, t);
        ctx.restore();
    }, [props?.draw]);

    const handleResize = useCallback((t: TimelineTransform) => {
        if (prevWidth !== t.widthPx) {
            forceUpdate();
        }
    }, [forceUpdate]);

    useLayoutEffect(() => {
        timelineController.subscribe(handleRenderCanvas);
        timelineController.subscribe(handleResize);

        return () => {
            timelineController.unsubscribe(handleRenderCanvas);
            timelineController.unsubscribe(handleResize);
        };
    }, [handleRenderCanvas, handleResize, timelineController]);

    useLayoutEffect(() => {
        handleRenderCanvas(timelineController.getTransform());
    }, deps ? [...deps] : undefined);

    useEffect(() => {
        handleRenderCanvas(timelineController.getTransform());
    });

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

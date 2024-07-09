import React from 'react';
import { TimelineTransform, Canvas, CanvasProps } from '@epam/uui-timeline';
import { renderBars, Item } from '@epam/uui-timeline';

export interface DemoCanvasBarsProps extends CanvasProps {
    items: Item[];
}

export function DemoCanvasBars(props: DemoCanvasBarsProps) {
    const canvasHeight = 30;
    const draw = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        ctx.clearRect(0, 0, t.widthMs, canvasHeight);

        const transformedItems = props.items
            .map((i) => ({
                ...i,
                priority: i.priority ? i.priority : 0,
                opacity: t.getScaleVisibility(i.minPixPerDay || 0, i.maxPxPerDay || 100500) * i.opacity,
                ...t.transformSegment(i.from, i.to),
            }))
            .filter((i) => i.isVisible && i.opacity > 0.01);

        renderBars(transformedItems, canvasHeight, ctx, t);
    };

    return <Canvas renderCanvas={ draw } canvasHeight={ canvasHeight } timelineController={ props.timelineController } />;
}

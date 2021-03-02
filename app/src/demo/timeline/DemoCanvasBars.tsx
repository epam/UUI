import { TimelineTransform } from '@epam/uui-timeline/TimelineTransform';
import { BaseTimelineCanvasComponent, BaseTimelineCanvasComponentProps } from '@epam/uui-timeline/BaseTimelineCanvasComponent';
import { renderBars, Item } from '@epam/uui-timeline/renderBars';

export interface DemoCanvasBarsProps extends BaseTimelineCanvasComponentProps {
    items: Item[];
}

export class DemoCanvasBars extends BaseTimelineCanvasComponent<DemoCanvasBarsProps, {}> {
    canvasHeight = 30;

    protected renderCanvas(ctx: CanvasRenderingContext2D, t: TimelineTransform): void {
        ctx.clearRect(0, 0, window.outerWidth, this.canvasHeight);       

        const transformedItems = this.props.items
            .map(i => ({
            ...i,
            priority: i.priority ? i.priority : 0,
            opacity: t.getScaleVisibility(i.minPixPerDay || 0, i.maxPxPerDay || 100500) * i.opacity,
            ...t.transformSegment(i.from, i.to)
        })).filter(i => i.isVisible && i.opacity > 0.01)

        renderBars(transformedItems, this.canvasHeight, ctx, t);
    }
}
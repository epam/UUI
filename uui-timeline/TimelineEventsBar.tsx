import * as React from 'react';
import { TimelineController } from './TimelineController';
import { BaseTimelineCanvasComponent } from './BaseTimelineCanvasComponent';
import { TimelineTransform } from './TimelineTransform';
import { getleftXforCentering } from './helpers';

export interface Stage {
    eventName: string;
    name: string;
    startDate: Date;
    endDate: Date;
    color: string;
}

export interface TimelineEventsBarProps {
    timelineController: TimelineController;
    stages: Stage[];
}

export class TimelineEventsBar extends BaseTimelineCanvasComponent<TimelineEventsBarProps> {
    protected canvasHeight = 14;

    renderTodayLine = (ctx: CanvasRenderingContext2D, t: TimelineTransform, yFrom: number, yTo: number) => {
        ctx.strokeStyle = '#F37B94';
        ctx.beginPath();
        ctx.moveTo(t.getX(new Date()), yFrom);
        ctx.lineTo(t.getX(new Date()), yTo);
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    renderStage(ctx: CanvasRenderingContext2D, t: TimelineTransform, stage: Stage) {
        const stageSegment = {
            ...t.transformSegment(stage.startDate, stage.endDate),
        };

        let thickness = 2;
        ctx.fillStyle = '#fff';
        ctx.fillRect(
            stageSegment.leftTrimmed - thickness,
            0,
            stageSegment.widthTrimmed + thickness * 2,
            this.canvasHeight + thickness * 2 - thickness,
        );

        ctx.fillStyle = stage.color;
        ctx.fillRect(stageSegment.leftTrimmed, 0, stageSegment.widthTrimmed, this.canvasHeight - thickness);

        let padding = 12;
        let text = stage.eventName + ' ' + stage.name;
        let textWidth = ctx.measureText(text).width;
        let left = getleftXforCentering(stageSegment, textWidth, padding);

        if (left == null) {
            text = stage.eventName;
            textWidth = ctx.measureText(text).width;
            left = getleftXforCentering(stageSegment, textWidth, padding);
        }

        ctx.fillStyle = '#fff';
        ctx.font = '11px Source Sans Pro Regular';

        if (left != null) {
            ctx.fillText(text, left, 10);
        }
    }

    protected renderCanvas(ctx: CanvasRenderingContext2D, t: TimelineTransform): void {
        ctx.clearRect(0, 0, window.outerWidth, this.canvasHeight);
        this.props.stages.forEach(stage => this.renderStage(ctx, t, stage));
        // render today line on border
        this.renderTodayLine(ctx, t, this.canvasHeight - 2, this.canvasHeight);
    }

    public render() {
        return this.renderCanvasElement();
    }
}

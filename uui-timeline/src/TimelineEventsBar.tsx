import React from 'react';
import { TimelineController } from './TimelineController';
import { TimelineTransform } from './TimelineTransform';
import { getleftXforCentering } from './helpers';
import { Canvas } from './Canvas';

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

export function TimelineEventsBar({ stages, timelineController }: TimelineEventsBarProps) {
    const canvasHeight = 14;
    const renderTodayLine = (ctx: CanvasRenderingContext2D, t: TimelineTransform, yFrom: number, yTo: number) => {
        ctx.strokeStyle = '#F37B94';
        ctx.beginPath();
        ctx.moveTo(t.getX(new Date()), yFrom);
        ctx.lineTo(t.getX(new Date()), yTo);
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    const renderStage = (ctx: CanvasRenderingContext2D, t: TimelineTransform, stage: Stage) => {
        const stageSegment = {
            ...t.transformSegment(stage.startDate, stage.endDate),
        };

        const thickness = 2;
        ctx.fillStyle = '#fff';
        ctx.fillRect(stageSegment.leftTrimmed - thickness, 0, stageSegment.widthTrimmed + thickness * 2, canvasHeight + thickness * 2 - thickness);

        ctx.fillStyle = stage.color;
        ctx.fillRect(stageSegment.leftTrimmed, 0, stageSegment.widthTrimmed, canvasHeight - thickness);

        const padding = 12;
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
    };

    const draw = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        ctx.clearRect(0, 0, t.widthMs, canvasHeight);
        stages.forEach((stage) => renderStage(ctx, t, stage));
        // render today line on border
        renderTodayLine(ctx, t, canvasHeight - 2, canvasHeight);
    };

    return <Canvas draw={ draw } canvasHeight={ canvasHeight } timelineController={ timelineController } />;
}

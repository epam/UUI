import React from 'react';
import { TimelineTransform } from './TimelineTransform';
import { msPerDay } from './helpers';
import { Canvas, CanvasProps } from './Canvas';

export interface TimelineGridProps extends CanvasProps {}

export function TimelineGrid({ timelineController, ...restProps }: TimelineGridProps) {
    const canvasHeight = restProps.canvasHeight ?? 60;
    const renderLine = (ctx: CanvasRenderingContext2D, x: number, width?: number) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.lineWidth = width || 1;
        ctx.stroke();
    };

    const renderHoliday = (ctx: CanvasRenderingContext2D, t: TimelineTransform, date: Date, x: number, width: number) => {
        if (t.isHoliday(date)) {
            ctx.fillStyle = 'rgba(249, 209, 204, 0.09)';
            ctx.fillRect(x, 0, width, canvasHeight);
            return;
        }

        if (t.isWeekend(date)) {
            ctx.fillStyle = '#FBFBFB';
            ctx.fillRect(x, 0, width, canvasHeight);
        }
    };

    const renderMinutes = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        t.getVisibleMinutes().forEach((w) => {
            renderLine(ctx, w.left);
        });
    };

    const renderQuoterHours = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        t.getVisibleQuoterHours().forEach((w) => {
            renderLine(ctx, w.left);
        });
    };

    const renderHours = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        const pxPerHour = (t.pxPerMs * msPerDay) / 24;
        const width = pxPerHour > 100 ? 2 : 1;

        t.getVisibleHours().forEach((w) => {
            renderLine(ctx, w.left, width);
        });
    };

    const renderHolidays = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        t.getVisibleDays().forEach((w) => {
            renderHoliday(ctx, t, w.leftDate, w.left, w.right - w.left + 1);
        });
    };

    const renderDays = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        const pxPerDay = t.pxPerMs * msPerDay;
        const width = pxPerDay > 200 ? 2 : 1;

        t.getVisibleDays().forEach((w) => {
            renderLine(ctx, w.left, width);
        });
    };

    const renderWeeks = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        t.getVisibleWeeks().forEach((w) => {
            renderLine(ctx, w.left);
        });
    };

    const renderMonths = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        t.getVisibleMonths().forEach((w) => {
            renderLine(ctx, w.left);
        });
    };

    const renderYears = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        t.getVisibleYears().forEach((w) => {
            renderLine(ctx, w.left, 2);
        });
    };

    const renderToday = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        ctx.strokeStyle = '#F37B94';
        ctx.beginPath();
        ctx.moveTo(t.getX(new Date()), 0);
        ctx.lineTo(t.getX(new Date()), canvasHeight);
        ctx.stroke();
    };

    const draw = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        ctx.clearRect(0, 0, t.widthPx, canvasHeight);
        ctx.strokeStyle = '#eee';

        const pxPerDay = t.pxPerMs * msPerDay;

        if (pxPerDay >= 40000) {
            renderMinutes(ctx, t);
        }

        if (pxPerDay >= 1600) {
            renderQuoterHours(ctx, t);
        }

        if (pxPerDay >= 190) {
            renderHours(ctx, t);
        }

        if (pxPerDay > 10) {
            renderDays(ctx, t);
        }

        if (pxPerDay > 2 && pxPerDay < 200) {
            renderHolidays(ctx, t);
        }

        if (pxPerDay > 2) {
            renderWeeks(ctx, t);
        }

        if (pxPerDay > 0.5) {
            renderMonths(ctx, t);
        }

        renderYears(ctx, t);

        renderToday(ctx, t);
    };
    
    return <Canvas renderCanvas={ restProps.renderCanvas ?? draw } canvasHeight={ canvasHeight } timelineController={ timelineController } />;
}

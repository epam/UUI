import { TimelineTransform } from './TimelineTransform';
import { BaseTimelineCanvasComponent, BaseTimelineCanvasComponentProps } from './BaseTimelineCanvasComponent';
import { msPerDay } from './helpers';

export interface TimelineGridProps extends BaseTimelineCanvasComponentProps {}

export class TimelineGrid extends BaseTimelineCanvasComponent<TimelineGridProps> {
    protected renderLine(ctx: CanvasRenderingContext2D, x: number, width?: number) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.canvasHeight);
        ctx.lineWidth = width || 1;
        ctx.stroke();
    }

    protected renderHoliday(ctx: CanvasRenderingContext2D, t: TimelineTransform, date: Date, x: number, width: number) {
        if (t.isHoliday(date)) {
            ctx.fillStyle = 'rgba(249, 209, 204, 0.09)';
            ctx.fillRect(x, 0, width, this.canvasHeight);
            return;
        }

        if (t.isWeekend(date)) {
            ctx.fillStyle = '#FBFBFB';
            ctx.fillRect(x, 0, width, this.canvasHeight);
        }
    }

    protected renderMinutes(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleMinutes().map((w) => {
            this.renderLine(ctx, w.left);
        });
    }

    protected renderQuoterHours(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleQuoterHours().map((w) => {
            this.renderLine(ctx, w.left);
        });
    }

    protected renderHours(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        const pxPerHour = (t.pxPerMs * msPerDay) / 24;
        const width = pxPerHour > 100 ? 2 : 1;

        t.getVisibleHours().map((w) => {
            this.renderLine(ctx, w.left, width);
        });
    }

    protected renderHolidays(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleDays().map((w) => {
            this.renderHoliday(ctx, t, w.leftDate, w.left, w.right - w.left + 1);
        });
    }

    protected renderDays(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        const pxPerDay = t.pxPerMs * msPerDay;
        const width = pxPerDay > 200 ? 2 : 1;

        t.getVisibleDays().map((w) => {
            this.renderLine(ctx, w.left, width);
        });
    }

    protected renderWeeks(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleWeeks().map((w) => {
            this.renderLine(ctx, w.left);
        });
    }

    protected renderMonths(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleMonths().map((w) => {
            this.renderLine(ctx, w.left);
        });
    }

    protected renderYears(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleYears().map((w) => {
            this.renderLine(ctx, w.left, 2);
        });
    }

    protected renderToday(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        ctx.strokeStyle = '#F37B94';
        ctx.beginPath();
        ctx.moveTo(t.getX(new Date()), 0);
        ctx.lineTo(t.getX(new Date()), this.canvasHeight);
        ctx.stroke();
    }

    protected renderCanvas(ctx: CanvasRenderingContext2D, t: TimelineTransform): void {
        ctx.clearRect(0, 0, t.widthPx, this.canvasHeight);
        ctx.strokeStyle = '#eee';

        const pxPerDay = t.pxPerMs * msPerDay;

        if (pxPerDay >= 40000) {
            this.renderMinutes(ctx, t);
        }

        if (pxPerDay >= 1600) {
            this.renderQuoterHours(ctx, t);
        }

        if (pxPerDay >= 190) {
            this.renderHours(ctx, t);
        }

        if (pxPerDay > 10) {
            this.renderDays(ctx, t);
        }

        if (pxPerDay > 2 && pxPerDay < 200) {
            this.renderHolidays(ctx, t);
        }

        if (pxPerDay > 2) {
            this.renderWeeks(ctx, t);
        }

        if (pxPerDay > 0.5) {
            this.renderMonths(ctx, t);
        }

        this.renderYears(ctx, t);

        this.renderToday(ctx, t);
    }
}

import { TimelineTransform } from './TimelineTransform';
import { BaseTimelineCanvasComponent, BaseTimelineCanvasComponentProps } from './BaseTimelineCanvasComponent';
import { msPerDay } from './helpers';

export interface TimelineGridProps extends BaseTimelineCanvasComponentProps {

}

export class TimelineGrid extends BaseTimelineCanvasComponent<TimelineGridProps, {}> {

    private renderLine(ctx: CanvasRenderingContext2D, x: number, width?: number) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.canvasHeight);
        ctx.lineWidth = width || 1;
        ctx.stroke();
    }

    renderHoliday(ctx: CanvasRenderingContext2D, t: TimelineTransform, date: Date, x: number, width: number) {
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

    private renderHours(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleHours().map(w => {
            this.renderLine(ctx, w.left);
        });
    }

    private renderHolidays(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleDays().map(w => {
            this.renderHoliday(ctx, t, w.leftDate, w.left, w.right - w.left + 1);
        });
    }

    private renderDays(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        const pxPerDay = t.pxPerMs * msPerDay;
        const width = pxPerDay > 200 ? 2 : 1;

        t.getVisibleDays().map(w => {
            this.renderLine(ctx, w.left, width);
        });
    }

    private renderWeeks(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleWeeks().map(w => {
            this.renderLine(ctx, w.left);
        });
    }

    private renderMonthes(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleMonths().map(w => {
            this.renderLine(ctx, w.left);
        });
    }

    private renderYears(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
        t.getVisibleYears().map(w => {
            this.renderLine(ctx, w.left, 2);
        });
    }

    private renderToday(ctx: CanvasRenderingContext2D, t: TimelineTransform) {
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

        if (pxPerDay > 0.50) {
            this.renderMonthes(ctx, t);
        }

        this.renderYears(ctx, t);

        this.renderToday(ctx, t);
    }
}
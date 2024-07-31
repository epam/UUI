import { TimelineController } from './TimelineController';
import { Viewport, CheckpointDate } from './types';
import {
    addDays, isWeekend, msPerDay, Scales,
} from './helpers';

export interface ScaleBar {
    left: number;
    right: number;
    leftDate: Date;
    rightDate: Date;
    key: string;
}

export class TimelineTransform {
    public centerMs: number;
    public leftMs: number;
    public rightMs: number;
    public widthMs: number;
    public pxPerMs: number;
    public widthPx: number;
    constructor(private controller: TimelineController, vp: Viewport) {
        this.centerMs = vp.center.getTime();
        this.widthPx = vp.widthPx;
        this.pxPerMs = vp.pxPerMs;
        this.widthMs = vp.widthPx / vp.pxPerMs;
        this.leftMs = this.centerMs - this.widthMs / 2;
        this.rightMs = this.centerMs + this.widthMs / 2;
    }

    getX(date: Date, trim?: undefined | 'left' | 'right'): number {
        let ms = date.getTime();

        if (trim == 'left' && ms < this.leftMs) {
            ms = this.leftMs;
        }

        if (trim == 'right' && ms > this.rightMs) {
            ms = this.rightMs;
        }

        const x = (ms - this.leftMs) * this.pxPerMs;

        return x;
    }

    getDate(mouseX: number) {
        return new Date(this.leftMs + mouseX / this.pxPerMs);
    }

    getPxInDay() {
        return this.getX(addDays(new Date(), 1)) - this.getX(new Date());
    }

    roundDateToMidday(date: Date) {
        date && date.setHours(12, 0, 0, 0);
        return date;
    }

    getRangeCheckpoint(listDates: CheckpointDate[], mouseX: number, widthCircle: number) {
        const leftDate = this.getDate(mouseX - widthCircle / 2);
        const rightDate = this.getDate(mouseX + widthCircle / 2);

        return listDates.filter((d) => leftDate <= d.date && d.date <= rightDate);
    }

    isVisible(date: Date): boolean {
        const ms = date.getTime();
        return this.leftMs <= ms || ms <= this.rightMs;
    }

    isHoliday(date: Date): boolean {
        if (this.controller.options.isHoliday) {
            return this.controller.options.isHoliday(date);
        }
        return false;
    }

    isWeekend(date: Date): boolean {
        return isWeekend(date);
    }

    transformSegment(left: Date, right: Date) {
        const leftBorder = left ? left : new Date(this.leftMs);
        const rightBorder = right ? right : new Date(this.rightMs);

        const result = {
            left: this.getX(leftBorder),
            right: this.getX(rightBorder),
            width: 0,
            leftTrimmed: this.getX(leftBorder, 'left'),
            rightTrimmed: this.getX(rightBorder, 'right'),
            widthTrimmed: 0,
            isVisible: leftBorder.getTime() < this.rightMs && rightBorder.getTime() > this.leftMs,
        };

        result.width = result.right - result.left;
        result.widthTrimmed = result.rightTrimmed - result.leftTrimmed;

        return result;
    }

    getScaleBars(alignStartDate: (nonAligned: Date) => Date, getNthDate: (baseDate: Date, n: number) => Date, keyPrefix: string): ScaleBar[] {
        const fromDate = new Date(this.leftMs);
        const toDate = new Date(this.rightMs);
        const baseDate = alignStartDate(fromDate);

        const result = [];
        let n = 0;

        while (true) {
            const leftDate = getNthDate(baseDate, n);
            const rightDate = getNthDate(baseDate, n + 1);

            if (leftDate > toDate) {
                break;
            }

            result.push({
                left: this.getX(leftDate),
                right: this.getX(rightDate) - 1,
                leftDate,
                rightDate,
                key: keyPrefix + n,
            });

            n++;
        }

        return result;
    }

    public getVisibleMonths() {
        return this.getScaleBars(
            (baseDate) => new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
            (baseDate, n) => new Date(baseDate.getFullYear(), baseDate.getMonth() + n),
            'M',
        );
    }

    public getVisibleWeeks() {
        return this.getScaleBars(
            (baseDate) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - baseDate.getDay() + 1),
            (baseDate, n) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + n * 7),
            'W',
        );
    }

    public getVisibleYears() {
        return this.getScaleBars(
            (baseDate) => new Date(baseDate.getFullYear(), 0, 1),
            (baseDate, n) => new Date(baseDate.getFullYear() + n, 0, 1),
            'Y',
        );
    }

    public getVisibleDays() {
        return this.getScaleBars(
            (baseDate) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()),
            (baseDate, n) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + n * 1),
            'D',
        );
    }

    public getVisibleHours() {
        return this.getScaleBars(
            (baseDate) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), baseDate.getHours()),
            (baseDate, n) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), baseDate.getHours() + n * 1),
            'H',
        );
    }

    public getVisibleQuarterHours() {
        return this.getScaleBars(
            (baseDate) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), baseDate.getHours()),
            (baseDate, n) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), baseDate.getHours(), baseDate.getMinutes() + n * 15),
            'Q',
        );
    }

    public getVisibleMinutes() {
        return this.getScaleBars(
            (baseDate) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), baseDate.getHours(), baseDate.getMinutes()),
            (baseDate, n) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), baseDate.getHours(), baseDate.getMinutes() + n),
            'm',
        );
    }

    public getScale() {
        const pxPerDay = this.pxPerMs * msPerDay;

        // These values are guessed and have no math behind them
        if (pxPerDay < 1.5) {
            return Scales.Year;
        } else if (pxPerDay < 10) {
            return Scales.Month;
        } else if (pxPerDay < 25) {
            return Scales.Week;
        } else {
            return Scales.Day;
        }
    }

    public getScaleVisibility(minPxPerDay: number, maxPxPerDay: number) {
        return this.controller.getScaleVisibility(minPxPerDay, maxPxPerDay);
    }
}

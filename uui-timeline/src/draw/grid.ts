import { msPerDay } from '../helpers';
import { CanvasDrawGridTodayLineProps, CanvasDrawHolidayOrWeekendProps, CanvasDrawHolidayProps, CanvasDrawHolidaysProps,
    CanvasDrawWeekendProps, CustomCanvasDrawTimelineElementProps } from './types';
import { timelinePrimitives } from './primitives';

const defaultLineWidth = {
    todayLineWidth: 3,
    lineWidth: 1,
};

const defaultColors = {
    defaultLineColor: '#eee',
    todayLineColor: '#FBB6B6',
    holidayCellColor: 'rgba(249, 209, 204, 0.09)',
    weekendCellColor: '#F5F6FA',
};

const drawHoliday = ({ context, x, width, height, holidayCellColor = defaultColors.holidayCellColor }: CanvasDrawHolidayProps) => {
    context.fillStyle = holidayCellColor;
    context.fillRect(x, 0, width, height);
};

const drawWeekend = ({ context, x, width, height, weekendCellColor = defaultColors.weekendCellColor }: CanvasDrawWeekendProps) => {
    context.fillStyle = weekendCellColor;
    context.fillRect(x, 0, width, height);
};

const drawHolidayOrWeekend = ({
    context,
    x,
    width,
    height,
    date,
    timelineTransform,
    holidayCellColor = defaultColors.holidayCellColor,
    weekendCellColor = defaultColors.weekendCellColor,
    ...restProps
}: CanvasDrawHolidayOrWeekendProps) => {
    if (timelineTransform.isHoliday(date)) {
        (restProps.drawHoliday ?? drawHoliday)({ context, x, width, height, holidayCellColor });
        return;
    }

    if (timelineTransform.isWeekend(date)) {
        (restProps.drawWeekend ?? drawWeekend)({ context, x, width, height, weekendCellColor });
    }
};

const drawMinutes = ({
    context, timelineTransform, canvasHeight, drawLine: customDrawLine, lineWidth = defaultLineWidth.lineWidth,
}: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleMinutes().forEach((w) => {
        (customDrawLine ?? timelinePrimitives.drawVerticalLine)({ context, x: w.left, y2: canvasHeight, width: lineWidth });
    });
};

const drawQuoterHours = ({
    context, timelineTransform, canvasHeight, drawLine: customDrawLine, lineWidth = defaultLineWidth.lineWidth,
}: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleQuoterHours().forEach((w) => {
        (customDrawLine ?? timelinePrimitives.drawVerticalLine)({ context, x: w.left, y2: canvasHeight, width: lineWidth });
    });
};

const drawHours = ({
    context, timelineTransform, canvasHeight, drawLine: customDrawLine, lineWidth,
}: CustomCanvasDrawTimelineElementProps) => {
    const pxPerHour = (timelineTransform.pxPerMs * msPerDay) / 24;
    const width = lineWidth ?? pxPerHour > 100 ? 2 : 1;

    timelineTransform.getVisibleHours().forEach((w) => {
        (customDrawLine ?? timelinePrimitives.drawVerticalLine)({ context, x: w.left, width, y2: canvasHeight });
    });
};

const drawHolidays = ({
    context, timelineTransform, canvasHeight,
    weekendCellColor = defaultColors.weekendCellColor,
    holidayCellColor = defaultColors.holidayCellColor,
    ...restProps
}: CanvasDrawHolidaysProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        (restProps.drawHolidayOrWeekend ?? drawHolidayOrWeekend)({
            context,
            timelineTransform,
            date: w.leftDate,
            x: w.left,
            width: w.right - w.left + 1,
            height: canvasHeight,
            weekendCellColor,
            holidayCellColor,
            drawHoliday: restProps.drawHoliday ?? drawHoliday,
            drawWeekend: restProps.drawWeekend ?? drawWeekend,
        });
    });
};

const drawDays = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    const pxPerDay = timelineTransform.pxPerMs * msPerDay;
    const width = pxPerDay > 200 ? 2 : 1;

    timelineTransform.getVisibleDays().forEach((w) => {
        (customDrawLine ?? timelinePrimitives.drawVerticalLine)({ context, x: w.left, width, y2: canvasHeight });
    });
};

const drawWeeks = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleWeeks().forEach((w) => {
        (customDrawLine ?? timelinePrimitives.drawVerticalLine)({ context, x: w.left, y2: canvasHeight });
    });
};

const drawMonths = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleMonths().forEach((w) => {
        (customDrawLine ?? timelinePrimitives.drawVerticalLine)({ context, x: w.left, y2: canvasHeight });
    });
};

const drawYears = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleYears().forEach((w) => {
        (customDrawLine ?? timelinePrimitives.drawVerticalLine)({ context, x: w.left, width: 2, y2: canvasHeight });
    });
};

const drawToday = ({
    context,
    timelineTransform,
    canvasHeight,
    todayLineWidth = defaultLineWidth.todayLineWidth,
    todayLineColor = defaultColors.todayLineColor,
}: CanvasDrawGridTodayLineProps) => {
    context.strokeStyle = todayLineColor;
    context.beginPath();
    context.moveTo(timelineTransform.getX(new Date()), 0);
    context.lineTo(timelineTransform.getX(new Date()), canvasHeight);
    context.lineWidth = todayLineWidth;
    context.stroke();
};

const shouldDrawMinutes = (pxPerDay: number) => pxPerDay >= 4000;
const shouldDrawQouterHours = (pxPerDay: number) => pxPerDay >= 1600;
const shouldDrawHours = (pxPerDay: number) => pxPerDay >= 190;
const shouldDrawDays = (pxPerDay: number) => pxPerDay > 10;
const shouldDrawHolidays = (pxPerDay: number) => pxPerDay > 6;
const shouldDrawWeeks = (pxPerDay: number) => pxPerDay > 6;
const shouldDrawMonths = (pxPerDay: number) => pxPerDay > 0.5 && pxPerDay <= 6;

export const timelineGrid = {
    drawHoliday,
    drawWeekend,
    drawHolidayOrWeekend,
    drawMinutes,
    drawQuoterHours,
    drawHours,
    drawHolidays,
    drawDays,
    drawWeeks,
    drawMonths,
    drawYears,
    drawToday,

    shouldDrawMinutes,
    shouldDrawQouterHours,
    shouldDrawHours,
    shouldDrawDays,
    shouldDrawHolidays,
    shouldDrawWeeks,
    shouldDrawMonths,

    defaultColors,
    defaultLineWidth,
};

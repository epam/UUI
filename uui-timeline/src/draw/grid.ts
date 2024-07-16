import { msPerDay } from '../helpers';
import { CanvasDrawGridTodayLineProps, CanvasDrawHolidayOrWeekendProps, CanvasDrawHolidayProps, CanvasDrawHolidaysProps,
    CanvasDrawLineProps, CanvasDrawWeekendProps, CustomCanvasDrawTimelineElementProps } from './types';

const defaultColors = {
    defaultLineColor: '#eee',
    todayLineColor: '#F37B94',
    holidayCellColor: 'rgba(249, 209, 204, 0.09)',
    weekendCellColor: '#FBFBFB',
};

const drawLine = ({ context, x, width, canvasHeight }: CanvasDrawLineProps) => {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvasHeight);
    context.lineWidth = width || 1;
    context.stroke();
};

const drawHoliday = ({ context, x, width, canvasHeight, holidayCellColor = defaultColors.holidayCellColor }: CanvasDrawHolidayProps) => {
    context.fillStyle = holidayCellColor;
    context.fillRect(x, 0, width, canvasHeight);
};

const drawWeekend = ({ context, x, width, canvasHeight, weekendCellColor = defaultColors.weekendCellColor }: CanvasDrawWeekendProps) => {
    context.fillStyle = weekendCellColor;
    context.fillRect(x, 0, width, canvasHeight);
};

const drawHolidayOrWeekend = ({
    context,
    x,
    width,
    canvasHeight,
    date,
    timelineTransform,
    holidayCellColor = defaultColors.holidayCellColor,
    weekendCellColor = defaultColors.weekendCellColor,
    ...restProps
}: CanvasDrawHolidayOrWeekendProps) => {
    if (timelineTransform.isHoliday(date)) {
        (restProps.drawHoliday ?? drawHoliday)({ context, x, width, canvasHeight, holidayCellColor });
        return;
    }

    if (timelineTransform.isWeekend(date)) {
        (restProps.drawWeekend ?? drawWeekend)({ context, x, width, canvasHeight, weekendCellColor });
    }
};

const drawMinutes = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleMinutes().forEach((w) => {
        (customDrawLine ?? drawLine)({ context, x: w.left, canvasHeight });
    });
};

const drawQuoterHours = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleQuoterHours().forEach((w) => {
        (customDrawLine ?? drawLine)({ context, x: w.left, canvasHeight });
    });
};

const drawHours = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    const pxPerHour = (timelineTransform.pxPerMs * msPerDay) / 24;
    const width = pxPerHour > 100 ? 2 : 1;

    timelineTransform.getVisibleHours().forEach((w) => {
        (customDrawLine ?? drawLine)({ context, x: w.left, width, canvasHeight });
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
            canvasHeight,
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
        (customDrawLine ?? drawLine)({ context, x: w.left, width, canvasHeight });
    });
};

const drawWeeks = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleWeeks().forEach((w) => {
        (customDrawLine ?? drawLine)({ context, x: w.left, canvasHeight });
    });
};

const drawMonths = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleMonths().forEach((w) => {
        (customDrawLine ?? drawLine)({ context, x: w.left, canvasHeight });
    });
};

const drawYears = ({ context, timelineTransform, canvasHeight, drawLine: customDrawLine }: CustomCanvasDrawTimelineElementProps) => {
    timelineTransform.getVisibleYears().forEach((w) => {
        (customDrawLine ?? drawLine)({ context, x: w.left, width: 2, canvasHeight });
    });
};

const drawToday = ({ context, timelineTransform, canvasHeight, todayLineColor = defaultColors.todayLineColor }: CanvasDrawGridTodayLineProps) => {
    context.strokeStyle = todayLineColor;
    context.beginPath();
    context.moveTo(timelineTransform.getX(new Date()), 0);
    context.lineTo(timelineTransform.getX(new Date()), canvasHeight);
    context.stroke();
};

export const timelineGrid = {
    drawLine,
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

    defaultColors,
};

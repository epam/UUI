import { msPerDay } from '../helpers';
import { CanvasDrawHolidayProps, CanvasDrawHolidaysProps, CanvasDrawLineProps, CanvasDrawTimelineElementProps, CustomCanvasDrawTimelineElementProps } from './types';

const drawLine = ({ context, x, width, canvasHeight }: CanvasDrawLineProps) => {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvasHeight);
    context.lineWidth = width || 1;
    context.stroke();
};

const drawHoliday = ({ context, x, width, canvasHeight }: CanvasDrawLineProps) => {
    context.fillStyle = 'rgba(249, 209, 204, 0.09)';
    context.fillRect(x, 0, width, canvasHeight);
};

const drawWeekend = ({ context, x, width, canvasHeight }: CanvasDrawLineProps) => {
    context.fillStyle = '#FBFBFB';
    context.fillRect(x, 0, width, canvasHeight);
};

const drawHolidayOrWeekend = ({ context, x, width, canvasHeight, date, timelineTransform }: CanvasDrawHolidayProps) => {
    if (timelineTransform.isHoliday(date)) {
        context.fillStyle = 'rgba(249, 209, 204, 0.09)';
        context.fillRect(x, 0, width, canvasHeight);
        return;
    }

    if (timelineTransform.isWeekend(date)) {
        context.fillStyle = '#FBFBFB';
        context.fillRect(x, 0, width, canvasHeight);
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
const drawHolidays = ({ context, timelineTransform, canvasHeight, drawHolidayOrWeekend: customDrawHolidayOrWeekend }: CanvasDrawHolidaysProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        (customDrawHolidayOrWeekend ?? drawHolidayOrWeekend)({
            context,
            timelineTransform,
            date: w.leftDate,
            x: w.left,
            width: w.right - w.left + 1,
            canvasHeight,
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

const drawToday = ({ context, timelineTransform, canvasHeight }: CanvasDrawTimelineElementProps) => {
    context.strokeStyle = '#F37B94';
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
};

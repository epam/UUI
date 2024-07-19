import { addDays, getHoursInFormatAMPM, months } from '../helpers';
import { timelinePrimitives } from './primitives';
import {
    CanvasDrawBottomBorderScaleProps,
    CanvasDrawDaysProps,
    CanvasDrawHeaderTodayProps,
    CanvasDrawPeriodFragmentProps,
    CanvasDrawPeriodPartProps,
    CanvasDrawPeriodProps,
    CanvasDrawPeriodWithTodayProps,
    CanvasDrawTopDaysProps,
    CanvasScaleRange,
} from './types';

const defaultFonts = {
    meridiemFont: '10px Sans Semibold',
    periodFont: '14px Sans Regular',
    currentPeriodFont: '14px Sans Semibold',
};

const defaultColors = {
    bottomBorderColor: '#999',
    periodTextColor: '#525462',
    topDayTextColor: '#2c2f3c',
    weekendTextColor: '#F37B94',
    todayLineColor: '#F37B94',
};

const moveAmount = 0.7;
const topLineMoveAmount = 0.8;

const isCurrentPeriod = (leftDate: Date, rightDate: Date) => new Date() >= leftDate && new Date() <= rightDate;

const drawBottomBorderScale = ({
    context,
    canvasHeight,
    timelineTransform,
    bottomBorderColor = defaultColors.bottomBorderColor,
}: CanvasDrawBottomBorderScaleProps) => {
    context.strokeStyle = bottomBorderColor;
    context.beginPath();
    context.moveTo(0, canvasHeight - 1);
    context.lineTo(timelineTransform.widthMs, canvasHeight - 1);
    context.stroke();
};

const drawPeriod = (
    {
        context,
        timelineTransform,
        minPxPerDay,
        maxPxPerDay,
        canvasHeight,
        draw,
        ...fonts
    }: CanvasDrawPeriodProps,
) => {
    const visibility = timelineTransform.getScaleVisibility(minPxPerDay, maxPxPerDay);

    if (!visibility) {
        return;
    }

    context.save();
    context.globalAlpha = visibility;

    draw({ context, timelineTransform, visibility, canvasHeight, ...fonts });

    context.restore();
};

const drawPeriodFragment = ({
    context,
    timelineTransform,
    text,
    x,
    width,
    line,
    isCurPeriod,
    textColor = defaultColors.periodTextColor,
    superscript,
    meridiemFont = defaultFonts.meridiemFont,
    periodFont = defaultFonts.periodFont,
    currentPeriodFont = defaultFonts.currentPeriodFont,
}: CanvasDrawPeriodFragmentProps) => {
    context.fillStyle = textColor;

    const padding = 12;
    const headerTextWidth = context.measureText(text).width;
    const textWidth = headerTextWidth + padding * 2;
    const center = x + width / 2;
    let left = center - textWidth / 2;

    // Stick to the edges
    if (width > 120) {
        const leftBound = 24;
        const rightBound = timelineTransform.widthPx - 24;
        const isOutOfLeftBound = left < leftBound;
        const isOutOfRightBound = left + textWidth > rightBound;
        if (isOutOfLeftBound) {
            left = leftBound;
        }
        if (isOutOfRightBound) {
            left = rightBound - textWidth;
        }
        if (left < x) {
            left = x;
        }
        if (left + textWidth > x + width) {
            left = x + width - textWidth;
        }
    }

    context.font = isCurPeriod ? currentPeriodFont : periodFont;
    context.fillText(text, left + padding, line * 24);

    if (superscript) {
        context.font = meridiemFont;
        context.fillText(superscript, left + padding + headerTextWidth + 3, (line - 1) * 24 + 20);
    }
};

const getBottomLine = (visibility: number) => 2 + (1 - visibility) * moveAmount;
const getTopLine = (visibility: number) => visibility * topLineMoveAmount;

const drawMinutes = ({
    context,
    timelineTransform,
    visibility,
    periodTextColor = defaultColors.periodTextColor,
    ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleMinutes().forEach((w) => {
        const text = w.leftDate.getHours().toString().padStart(2, '0') + ':' + w.leftDate.getMinutes().toString().padStart(2, '0');
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line: getBottomLine(visibility),
            isCurPeriod,
            textColor: periodTextColor,
            ...restProps,
        });
    });
};

const drawRemainingHours = ({
    context, timelineTransform, visibility, periodTextColor = defaultColors.periodTextColor, ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleHours()
        .filter((i) => i.leftDate.getHours() % 3 !== 0)
        .forEach((w) => {
            const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
            const text = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
            const superscript = hoursInFormatAMPM.slice(-2);
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            drawPeriodFragment({
                context,
                timelineTransform,
                text,
                x: w.left - (w.right - w.left) / 2,
                width: w.right - w.left,
                line: getBottomLine(visibility),
                isCurPeriod,
                textColor: periodTextColor,
                superscript,
                ...restProps,
            });
        });
};

const drawHours = ({
    context, timelineTransform, visibility, periodTextColor = defaultColors.periodTextColor, ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleHours()
        .filter((i) => i.leftDate.getHours() % 3 === 0)
        .forEach((w) => {
            const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
            const text = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
            const superscript = hoursInFormatAMPM.slice(-2);
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            drawPeriodFragment({
                context,
                timelineTransform,
                text,
                x: w.left - (w.right - w.left) / 2,
                width: w.right - w.left,
                line: getBottomLine(visibility),
                isCurPeriod,
                textColor: periodTextColor,
                superscript,
                ...restProps,
            });
        });
};

const drawToday = ({ context, scaleBar, todayLineColor = defaultColors.todayLineColor }: CanvasDrawHeaderTodayProps) => {
    if (isCurrentPeriod(scaleBar.leftDate, scaleBar.rightDate)) {
        context.fillStyle = todayLineColor;
        context.fillRect(scaleBar.left, 56, scaleBar.right - scaleBar.left, 4);
    }
};

const drawTopDays = ({
    context,
    timelineTransform,
    visibility,
    topDayTextColor = defaultColors.topDayTextColor,
    weekendTextColor = defaultColors.weekendTextColor,
    todayLineColor = defaultColors.todayLineColor,
    drawToday: customDrawToday,
    ...restProps
}: CanvasDrawTopDaysProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
        const header = months[w.leftDate.getMonth()] + ' ' + w.leftDate.getDate().toString() + ', ' + w.leftDate.getFullYear();
        let textColor = topDayTextColor;
        if (timelineTransform.isWeekend(w.leftDate) || timelineTransform.isHoliday(w.leftDate)) {
            textColor = weekendTextColor;
        }
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text: header.toUpperCase(),
            x: w.left,
            width: w.right - w.left,
            line: getTopLine(visibility),
            isCurPeriod,
            textColor,
            ...restProps,
        });
    });
};

const drawDays = ({
    context,
    timelineTransform,
    visibility,
    periodTextColor = defaultColors.periodTextColor,
    weekendTextColor = defaultColors.weekendTextColor,
    todayLineColor = defaultColors.todayLineColor,
    drawToday: customDrawToday,
    ...restProps
}: CanvasDrawDaysProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
        const text = w.leftDate.getDate().toString();
        let textColor = periodTextColor;
        if (timelineTransform.isWeekend(w.leftDate) || timelineTransform.isHoliday(w.leftDate)) {
            textColor = weekendTextColor;
        }
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text,
            textColor,
            x: w.left,
            width: w.right - w.left,
            line: getBottomLine(visibility),
            isCurPeriod,
            ...restProps,
        });
    });
};

const drawTopMonths = ({
    context, timelineTransform, visibility, periodTextColor = defaultColors.periodTextColor, canvasHeight, ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleMonths().forEach((w) => {
        const header = months[w.leftDate.getMonth()] + ' ' + w.leftDate.getFullYear();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        const y = canvasHeight / 2 - 1;
        if (w.leftDate.getMonth() % 2 === 0) {
            timelinePrimitives.drawRectangle({ context, x: w.left, y: 0, width: w.right - w.left + 1, height: y });
        }

        drawPeriodFragment({
            context,
            timelineTransform,
            text: header.toUpperCase(),
            x: w.left,
            width: w.right - w.left,
            line: getTopLine(visibility),
            isCurPeriod,
            textColor: periodTextColor,
            ...restProps,
        });

        timelinePrimitives.drawVerticalLine({ context, x: w.left, y2: y });
        timelinePrimitives.drawHorizontalLine({ context, x1: w.left, x2: w.right + 1, y: y });
    });
};

const drawWeeks = ({
    context,
    timelineTransform,
    visibility,
    periodTextColor = defaultColors.periodTextColor,
    todayLineColor = defaultColors.todayLineColor,
    drawToday: customDrawToday,
    canvasHeight,
    ...restProps
}: CanvasDrawPeriodWithTodayProps) => {
    timelineTransform.getVisibleWeeks().forEach((w) => {
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
        const text = w.leftDate.getDate() + ' – ' + addDays(w.rightDate, -1).getDate();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line: getBottomLine(visibility),
            isCurPeriod,
            textColor: periodTextColor,
            ...restProps,
        });

        timelinePrimitives.drawVerticalLine({ context, x: w.left, y1: canvasHeight / 2 - 1, y2: canvasHeight });
    });
};

const drawBottomMonths = ({
    context,
    timelineTransform,
    visibility,
    canvasHeight,
    periodTextColor = defaultColors.periodTextColor,
    todayLineColor = defaultColors.todayLineColor,
    drawToday: customDrawToday,
    ...restProps
}: CanvasDrawPeriodWithTodayProps) => {
    timelineTransform.getVisibleMonths().forEach((w) => {
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
        const text = months[w.leftDate.getMonth()].toString();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line: getBottomLine(visibility),
            isCurPeriod,
            textColor: periodTextColor,
            ...restProps,
        });

        timelinePrimitives.drawVerticalLine({ context, x: w.left, y1: canvasHeight / 2 - 1, y2: canvasHeight });
    });
};

const drawYears = ({
    context,
    timelineTransform,
    visibility,
    periodTextColor = defaultColors.periodTextColor,
    todayLineColor = defaultColors.todayLineColor,
    drawToday: customDrawToday,
    canvasHeight,
    ...restProps
}: CanvasDrawPeriodWithTodayProps) => {
    const isBottom = timelineTransform.getScaleVisibility(null, 1);
    timelineTransform.getVisibleYears().forEach((w) => {
        isBottom && (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
        const text = w.leftDate.getFullYear().toString().toUpperCase();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        const textMoveAmount = isBottom ? moveAmount : topLineMoveAmount;
        const line = (visibility + isBottom) * textMoveAmount;
        drawPeriodFragment({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line,
            isCurPeriod,
            textColor: periodTextColor,
            ...restProps,
        });

        const y = isBottom ? canvasHeight : canvasHeight / 2 - 1;
        timelinePrimitives.drawVerticalLine({ context, x: w.left, y2: y });
        timelinePrimitives.drawHorizontalLine({ context, x1: w.left, x2: w.right + 1, y: y });
    });
};

export const getMinutesScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 40000, maxPxPerDay: null });
export const getRemainingHoursScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 800, maxPxPerDay: 40000 });
export const getHoursScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 200, maxPxPerDay: 20000 });
export const getTopDaysScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 200, maxPxPerDay: null });
export const getDaysScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 20, maxPxPerDay: 200 });
export const getTopMonthsScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 6, maxPxPerDay: 200 });
export const getWeeksScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 6, maxPxPerDay: 20 });
export const getBottomMonthsScaleRange = (): CanvasScaleRange => ({ minPxPerDay: 1, maxPxPerDay: 6 });
export const getYearsScaleRange = (): CanvasScaleRange => ({ minPxPerDay: null, maxPxPerDay: 6 });

export const timelineScale = {
    drawBottomBorderScale,
    drawPeriod,
    drawMinutes,
    drawRemainingHours,
    drawHours,
    drawToday,
    drawPeriodFragment,
    drawTopDays,
    drawDays,
    drawTopMonths,
    drawWeeks,
    drawBottomMonths,
    drawYears,
    isCurrentPeriod,
    getMinutesScaleRange,
    getRemainingHoursScaleRange,
    getHoursScaleRange,
    getTopDaysScaleRange,
    getDaysScaleRange,
    getTopMonthsScaleRange,
    getWeeksScaleRange,
    getBottomMonthsScaleRange,
    getYearsScaleRange,

    defaultFonts,
    defaultColors,
};

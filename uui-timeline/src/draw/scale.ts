import { addDays, getHoursInFormatAMPM, months } from '../helpers';
import { timelinePrimitives } from './primitives';
import {
    CanvasDrawBorderForTopCell,
    CanvasDrawBottomBorderScaleProps,
    CanvasDrawDaysProps,
    CanvasDrawHeaderTodayProps,
    CanvasDrawPeriodFragmentProps,
    CanvasDrawPeriodPartProps,
    CanvasDrawPeriodProps,
    CanvasDrawPeriodWithTodayProps,
    CanvasDrawCellBackground,
    CanvasDrawTopDaysProps,
    CanvasScaleRange,
    CanvasDrawBottomGridLine,
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
    weekendTextColor: '#ACAFBF',
    weekendCellColor: '#F5F6FA',
    todayLineColor: '#F37B94',
    evenPeriodColor: '#FFFFFF',
};

const moveAmount = 0.7;
const topLineMoveAmount = 0.8;

const isCurrentPeriod = (leftDate: Date, rightDate: Date) => new Date() >= leftDate && new Date() <= rightDate;

const getCanvasVerticalCenter = (canvasHeight: number) => canvasHeight / 2 - 1;
const getBottomCellY = (canvasHeight: number) => getCanvasVerticalCenter(canvasHeight);

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

const drawBorderForTopCell = ({
    context,
    canvasHeight,
    scaleBar,
}: CanvasDrawBorderForTopCell) => {
    const y = getCanvasVerticalCenter(canvasHeight);
    timelinePrimitives.drawHorizontalLine({ context, x1: scaleBar.left, x2: scaleBar.right + 1, y });
    timelinePrimitives.drawVerticalLine({ context, x: scaleBar.left + + 0.5, y2: y });
};

const drawBottomGridLine = ({
    context,
    scaleBar,
    canvasHeight,
}: CanvasDrawBottomGridLine) => {
    const y = getCanvasVerticalCenter(canvasHeight);
    timelinePrimitives.drawVerticalLine({ context, x: scaleBar.left + 0.5, y1: y, y2: canvasHeight - 2 });
};

const drawCellBackground = ({
    context,
    canvasHeight,
    height = getCanvasVerticalCenter(canvasHeight),
    scaleBar,
    color = timelinePrimitives.defaultColors.defaultRectangleColor,
    y = 0,
}: CanvasDrawCellBackground) => {
    timelinePrimitives.drawRectangle({
        context,
        x: scaleBar.left,
        y,
        width: scaleBar.right - scaleBar.left + + 0.5,
        height,
        color,
    });
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

const drawPeriodText = ({
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
    canvasHeight,
    periodTextColor = defaultColors.periodTextColor,
    ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleMinutes().forEach((w) => {
        const text = w.leftDate.getHours().toString().padStart(2, '0') + ':' + w.leftDate.getMinutes().toString().padStart(2, '0');
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawCellBackground({ context, scaleBar: w, canvasHeight, y: getBottomCellY(canvasHeight) });
        drawPeriodText({
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
        drawBottomGridLine({ context, canvasHeight, scaleBar: w });
    });
};

const drawRemainingHours = ({
    context, timelineTransform, visibility, periodTextColor = defaultColors.periodTextColor, canvasHeight, ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleHours()
        .forEach((w) => drawCellBackground({ context, scaleBar: w, canvasHeight, y: getBottomCellY(canvasHeight) }));

    timelineTransform.getVisibleHours()
        .filter((i) => i.leftDate.getHours() % 3 !== 0)
        .forEach((w) => {
            const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
            const text = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
            const superscript = hoursInFormatAMPM.slice(-2);
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            drawPeriodText({
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
    context, timelineTransform, visibility, canvasHeight, periodTextColor = defaultColors.periodTextColor, ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleHours()
        .forEach((w) => {
            const { minPxPerDay, maxPxPerDay } = timelineScale.getRemainingHoursScaleRange();
            const remainingHoursVisible = timelineTransform.getScaleVisibility(minPxPerDay, maxPxPerDay);
            if (!remainingHoursVisible) {
                drawCellBackground({ context, scaleBar: w, canvasHeight, y: getBottomCellY(canvasHeight) });
            }
        });

    timelineTransform.getVisibleHours()
        .filter((i) => i.leftDate.getHours() % 3 === 0)
        .forEach((w) => {
            const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
            const text = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
            const superscript = hoursInFormatAMPM.slice(-2);
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            drawPeriodText({
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
        context.fillRect(scaleBar.left + 1, 56, scaleBar.right - scaleBar.left, 4);
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
    canvasHeight,
    ...restProps
}: CanvasDrawTopDaysProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        const header = months[w.leftDate.getMonth()] + ' ' + w.leftDate.getDate().toString() + ', ' + w.leftDate.getFullYear();
        const isHoliday = timelineTransform.isWeekend(w.leftDate) || timelineTransform.isHoliday(w.leftDate);
        const color = isHoliday ? defaultColors.weekendCellColor : timelinePrimitives.defaultColors.defaultRectangleColor;
        drawCellBackground({ context, scaleBar: w, canvasHeight, color });

        const textColor = isHoliday ? weekendTextColor : topDayTextColor;
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodText({
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
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
        drawBorderForTopCell({ context, canvasHeight, scaleBar: w });
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
    canvasHeight,
    ...restProps
}: CanvasDrawDaysProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        const text = w.leftDate.getDate().toString();
        const isHoliday = timelineTransform.isWeekend(w.leftDate) || timelineTransform.isHoliday(w.leftDate);
        const color = isHoliday ? defaultColors.weekendCellColor : timelinePrimitives.defaultColors.defaultRectangleColor;
        drawCellBackground({ context, scaleBar: w, canvasHeight, y: getCanvasVerticalCenter(canvasHeight), color });

        const textColor = isHoliday ? weekendTextColor : periodTextColor;
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodText({
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
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
        drawBottomGridLine({ context, canvasHeight, scaleBar: w });
    });
};

const drawTopMonths = ({
    context, timelineTransform, visibility, periodTextColor = defaultColors.periodTextColor, canvasHeight, ...restProps
}: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleMonths().forEach((w) => {
        const header = months[w.leftDate.getMonth()] + ' ' + w.leftDate.getFullYear();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        const color = w.leftDate.getMonth() % 2 === 0
            ? timelinePrimitives.defaultColors.defaultRectangleColor
            : defaultColors.evenPeriodColor;

        drawCellBackground({ context, scaleBar: w, canvasHeight, color });

        drawPeriodText({
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
        drawBorderForTopCell({ context, canvasHeight, scaleBar: w });
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
        const text = w.leftDate.getDate() + ' – ' + addDays(w.rightDate, -1).getDate();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawCellBackground({ context, scaleBar: w, canvasHeight, y: getCanvasVerticalCenter(canvasHeight) });

        drawPeriodText({
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
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
        drawBottomGridLine({ context, canvasHeight, scaleBar: w });
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
        const text = months[w.leftDate.getMonth()].toString();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawCellBackground({ context, scaleBar: w, canvasHeight, y: getCanvasVerticalCenter(canvasHeight) });

        drawPeriodText({
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
        (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
        drawBottomGridLine({ context, canvasHeight, scaleBar: w });
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
        const text = w.leftDate.getFullYear().toString().toUpperCase();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        const textMoveAmount = isBottom ? moveAmount : topLineMoveAmount;
        const line = (visibility + isBottom) * textMoveAmount;
        if (isBottom) {
            const y = canvasHeight;
            timelinePrimitives.drawHorizontalLine({ context, x1: w.left, x2: w.right + 1, y: y - 1 });
            drawCellBackground({ context, scaleBar: w, canvasHeight, height: canvasHeight });
            (customDrawToday ?? drawToday)({ context, scaleBar: w, todayLineColor });
            timelinePrimitives.drawVerticalLine({ context, x: w.left + 0.5, y2: y - 1 });
        } else {
            const color = w.leftDate.getFullYear() % 2 === 0
                ? timelinePrimitives.defaultColors.defaultRectangleColor
                : defaultColors.evenPeriodColor;

            drawCellBackground({ context, scaleBar: w, canvasHeight, color });
            drawBorderForTopCell({ context, canvasHeight, scaleBar: w });
        }

        drawPeriodText({
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
    drawPeriodText,
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

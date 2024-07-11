import { addDays, getHoursInFormatAMPM, months } from '../helpers';
import { CanvasDrawHeaderTodayProps, CanvasDrawPeriodFragmentProps, CanvasDrawPeriodPartProps, CanvasDrawPeriodProps, CanvasDrawTimelineElementProps, CanvasDrawTimelineHeaderProps } from './types';

const defaultFonts = {
    meridiemFont: '10px Sans Semibold',
    periodFont: '14px Sans Regular',
    currentPeriodFont: '14px Sans Semibold',
};

const moveAmount = 0.7;

const isCurrentPeriod = (leftDate: Date, rightDate: Date) => new Date() >= leftDate && new Date() <= rightDate;

const drawBottomBorderScale = ({ context, canvasHeight, timelineTransform }: CanvasDrawTimelineElementProps) => {
    context.strokeStyle = '#999';
    context.beginPath();
    context.moveTo(0, canvasHeight);
    context.lineTo(timelineTransform.widthMs, canvasHeight);
    context.stroke();
};

const drawPeriod = (
    {
        context,
        timelineTransform,
        minPxPerDay,
        maxPxPerDay,
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

    draw({ context, timelineTransform, visibility, ...fonts });

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
    textColor = '#525462',
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

const drawMinutes = ({
    context,
    timelineTransform,
    visibility,
    ...fonts
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
            line: 2 + (1 - visibility) * moveAmount,
            isCurPeriod,
            textColor: '#525462',
            ...fonts,
        });
    });
};

const drawRemainingHours = ({ context, timelineTransform, visibility, ...fonts }: CanvasDrawPeriodPartProps) => {
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
                line: 2 + (1 - visibility) * moveAmount,
                isCurPeriod,
                textColor: '#525462',
                superscript,
                ...fonts,
            });
        });
};

const drawHours = ({ context, timelineTransform, visibility, ...fonts }: CanvasDrawPeriodPartProps) => {
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
                line: 2 + (1 - visibility) * moveAmount,
                isCurPeriod,
                textColor: '#525462',
                superscript,
                ...fonts,
            });
        });
};

const drawToday = ({ context, scaleBar }: CanvasDrawHeaderTodayProps) => {
    if (isCurrentPeriod(scaleBar.leftDate, scaleBar.rightDate)) {
        context.fillStyle = '#F37B94';
        context.fillRect(scaleBar.left, 56, scaleBar.right - scaleBar.left, 4);
    }
};

const drawTopDays = ({ context, timelineTransform, visibility, ...fonts }: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        drawToday({ context, scaleBar: w });
        const header = months[w.leftDate.getMonth()] + ' ' + w.leftDate.getDate().toString() + ', ' + w.leftDate.getFullYear();
        let textColor = '#2c2f3c';
        if (timelineTransform.isWeekend(w.leftDate) || timelineTransform.isHoliday(w.leftDate)) {
            textColor = '#F37B94';
        }
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text: header.toUpperCase(),
            x: w.left,
            width: w.right - w.left,
            line: 1 - (1 - visibility) * moveAmount,
            isCurPeriod,
            textColor,
            ...fonts,
        });
    });
};

const drawDays = ({ context, timelineTransform, visibility, ...fonts }: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleDays().forEach((w) => {
        drawToday({ context, scaleBar: w });
        const text = w.leftDate.getDate().toString();
        let textColor;
        if (timelineTransform.isWeekend(w.leftDate) || timelineTransform.isHoliday(w.leftDate)) {
            textColor = '#F37B94';
        }
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text,
            textColor,
            x: w.left,
            width: w.right - w.left,
            line: 2 + (1 - visibility) * moveAmount,
            isCurPeriod,
            ...fonts,
        });
    });
};

const drawTopMonths = ({ context, timelineTransform, visibility, ...fonts }: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleMonths().forEach((w) => {
        const header = months[w.leftDate.getMonth()] + ' ' + w.leftDate.getFullYear();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);

        drawPeriodFragment({
            context,
            timelineTransform,
            text: header.toUpperCase(),
            x: w.left,
            width: w.right - w.left,
            line: 1 - (1 - visibility) * moveAmount,
            isCurPeriod,
            ...fonts,
        });
    });
};

const drawWeeks = ({ context, timelineTransform, visibility, ...fonts }: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleWeeks().forEach((w) => {
        drawToday({ context, scaleBar: w });
        const text = w.leftDate.getDate() + ' – ' + addDays(w.rightDate, -1).getDate();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line: 2 + (1 - visibility) * moveAmount,
            isCurPeriod,
            ...fonts,
        });
    });
};

const drawBottomMonths = ({ context, timelineTransform, visibility, ...fonts }: CanvasDrawPeriodPartProps) => {
    timelineTransform.getVisibleMonths().forEach((w) => {
        drawToday({ context, scaleBar: w });
        const text = months[w.leftDate.getMonth()].toString();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line: 2 + (1 - visibility) * moveAmount,
            isCurPeriod,
            ...fonts,
        });
    });
};

const drawYears = ({ context, timelineTransform, visibility, ...fonts }: CanvasDrawPeriodPartProps) => {
    const isBottom = timelineTransform.getScaleVisibility(null, 1);
    timelineTransform.getVisibleYears().forEach((w) => {
        isBottom && drawToday({ context, scaleBar: w });
        const text = w.leftDate.getFullYear().toString().toUpperCase();
        const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
        drawPeriodFragment({
            context,
            timelineTransform,
            text,
            x: w.left,
            width: w.right - w.left,
            line: visibility + isBottom,
            isCurPeriod,
            ...fonts,
        });
    });
};

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
    defaultFonts,
};

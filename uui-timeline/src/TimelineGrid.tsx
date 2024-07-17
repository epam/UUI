import React from 'react';
import { TimelineTransform } from './TimelineTransform';
import { msPerDay } from './helpers';
import { TimelineCanvas, TimelineCanvasProps } from './TimelineCanvas';
import { CanvasDrawGridTodayLineProps, CanvasDrawHolidayProps, CanvasDrawLineProps, CanvasDrawTimelineElementProps,
    CanvasDrawWeekendProps, timelineGrid } from './draw';

export interface TimelineGridProps extends TimelineCanvasProps {
    drawLine?: (props: CanvasDrawLineProps) => void;
    drawMinutes?: (props: CanvasDrawTimelineElementProps) => void;
    drawHours?: (props: CanvasDrawTimelineElementProps) => void;
    drawDays?: (props: CanvasDrawTimelineElementProps) => void;
    drawQuoterHours?: (props: CanvasDrawTimelineElementProps) => void;
    drawHolidays?: (props: CanvasDrawTimelineElementProps) => void;
    drawWeeks?: (props: CanvasDrawTimelineElementProps) => void;
    drawMonths?: (props: CanvasDrawTimelineElementProps) => void;
    drawYears?: (props: CanvasDrawTimelineElementProps) => void;
    drawToday?: (props: CanvasDrawGridTodayLineProps) => void;
    drawHoliday?: (props: CanvasDrawHolidayProps) => void;
    drawWeekend?: (props: CanvasDrawWeekendProps) => void;
    
    defaultLineColor?: string;
    todayLineColor?: string;
    weekendCellColor?: string;
    holidayCellColor?: string;
}
export function TimelineGrid({ 
    timelineController,
    drawLine,
    drawMinutes,
    drawQuoterHours,
    drawHours,
    drawDays,
    drawHolidays,
    drawWeeks,
    drawMonths,
    drawYears,
    drawToday,
    drawWeekend,
    drawHoliday,

    defaultLineColor = timelineGrid.defaultColors.defaultLineColor,
    todayLineColor = timelineGrid.defaultColors.todayLineColor,
    weekendCellColor = timelineGrid.defaultColors.weekendCellColor,
    holidayCellColor = timelineGrid.defaultColors.holidayCellColor,
    ...restProps
}: TimelineGridProps) {
    const canvasHeight = restProps.canvasHeight ?? 60;

    const draw = (context: CanvasRenderingContext2D, timelineTransform: TimelineTransform) => {
        context.clearRect(0, 0, timelineTransform.widthPx, canvasHeight);
        context.strokeStyle = defaultLineColor;

        const pxPerDay = timelineTransform.pxPerMs * msPerDay;

        const drawProps = { context, timelineTransform, canvasHeight };
        const options = {
            ...drawProps,
            drawLine: drawLine ?? timelineGrid.drawLine,
        };
        if (timelineGrid.shouldDrawMinutes(pxPerDay)) {
            (drawMinutes ?? timelineGrid.drawMinutes)(options);
        }

        if (timelineGrid.shouldDrawQouterHours(pxPerDay)) {
            (drawQuoterHours ?? timelineGrid.drawQuoterHours)(options);
        }

        if (timelineGrid.shouldDrawHours(pxPerDay)) {
            (drawHours ?? timelineGrid.drawHours)(options);
        }

        if (timelineGrid.shouldDrawDays(pxPerDay)) {
            (drawDays ?? timelineGrid.drawDays)(options);
        }

        if (timelineGrid.shouldDrawHolidays(pxPerDay)) {
            (drawHolidays ?? timelineGrid.drawHolidays)({
                ...options,
                drawWeekend: drawWeekend ?? timelineGrid.drawWeekend,
                drawHoliday: drawHoliday ?? timelineGrid.drawHoliday,
                weekendCellColor,
                holidayCellColor,
            });
        }

        if (timelineGrid.shouldDrawWeeks(pxPerDay)) {
            (drawWeeks ?? timelineGrid.drawWeeks)(options);
        }

        if (timelineGrid.shouldDrawMonths(pxPerDay)) {
            (drawMonths ?? timelineGrid.drawMonths)(options);
        }

        (drawYears ?? timelineGrid.drawYears)(options);
        (drawToday ?? timelineGrid.drawToday)({ ...drawProps, todayLineColor });
    };

    return (
        <TimelineCanvas
            draw={ restProps.draw ?? draw }
            canvasHeight={ canvasHeight }
            timelineController={ timelineController }
        />
    );
}

import React from 'react';
import { TimelineTransform } from './TimelineTransform';
import { msPerDay } from './helpers';
import { TimelineCanvas, TimelineCanvasProps } from './TimelineCanvas';
import { CanvasDrawGridTodayLineProps, CanvasDrawHolidayProps, CanvasDrawLineProps, CanvasDrawTimelineElementProps,
    CanvasDrawWeekendProps, timelineGrid, timelinePrimitives } from './draw';

/**
 * TimelineGrid props.
 */
export interface TimelineGridProps extends TimelineCanvasProps {
    /**
     * Overrides draw function for all grid lines.
     */
    drawLine?: (props: CanvasDrawLineProps) => void;
    /**
     * Overrides draw minutes function.
     */
    drawMinutes?: (props: CanvasDrawTimelineElementProps) => void;
    /**
     * Overrides draw hours function.
     */
    drawHours?: (props: CanvasDrawTimelineElementProps) => void;
    /**
     * Overrides draw days function.
     */
    drawDays?: (props: CanvasDrawTimelineElementProps) => void;
    /**
     * Overrides draw quarter hours function.
     */
    drawQuarterHours?: (props: CanvasDrawTimelineElementProps) => void;
    /**
     * Overrides draw holidays function.
     */
    drawHolidays?: (props: CanvasDrawTimelineElementProps) => void;
    /**
     * Overrides draw weeks function.
     */
    drawWeeks?: (props: CanvasDrawTimelineElementProps) => void;
    /**
     * Overrides draw weeks function.
     */
    drawMonths?: (props: CanvasDrawTimelineElementProps) => void;
    /**
     * Overrides draw years function.
     */
    drawYears?: (props: CanvasDrawTimelineElementProps) => void;
    /**
     * Overrides draw today function.
     */
    drawToday?: (props: CanvasDrawGridTodayLineProps) => void;
    /**
     * Overrides draw holiday function.
     */
    drawHoliday?: (props: CanvasDrawHolidayProps) => void;
    /**
     * Overrides draw weekend function.
     */
    drawWeekend?: (props: CanvasDrawWeekendProps) => void;
    
    /**
     * Overrides grid lines color.
     */
    regularLineColor?: string;
    /**
     * Overrides today line color.
     */
    todayLineColor?: string;

    /**
     * Overrides weekend cell background color.
     */
    weekendCellColor?: string;
    /**
     * Overrides holiday cell background color.
     */
    holidayCellColor?: string; 
    /**
     * Overrides today line width.
     */
    todayLineWidth?: number;
    /**
     * Overrides regular line width.
     */
    regularLineWidth?: number;
}

/**
 * Timeline grid, which draws years/months/weeks/days/hours/minutes on the timeline body.
 */
export function TimelineGrid({ 
    timelineController,
    drawLine,
    drawMinutes,
    drawQuarterHours,
    drawHours,
    drawDays,
    drawHolidays,
    drawWeeks,
    drawMonths,
    drawYears,
    drawToday,
    drawWeekend,
    drawHoliday,

    regularLineColor = timelineGrid.defaultColors.regularLineColor,
    todayLineColor = timelineGrid.defaultColors.todayLineColor,
    weekendCellColor = timelineGrid.defaultColors.weekendCellColor,
    holidayCellColor = timelineGrid.defaultColors.holidayCellColor,
    todayLineWidth = timelineGrid.defaultLineWidth.todayLineWidth,
    regularLineWidth = timelineGrid.defaultLineWidth.regularLineWidth,
    ...restProps
}: TimelineGridProps) {
    const canvasHeight = restProps.canvasHeight ?? 60;

    const draw = (context: CanvasRenderingContext2D, timelineTransform: TimelineTransform) => {
        context.clearRect(0, 0, timelineTransform.widthPx, canvasHeight);
        context.strokeStyle = regularLineColor;

        const pxPerDay = timelineTransform.pxPerMs * msPerDay;

        const drawProps = { context, timelineTransform, canvasHeight };

        if (timelineGrid.shouldDrawHolidays(pxPerDay)) {
            (drawHolidays ?? timelineGrid.drawHolidays)({
                ...drawProps,
                canvasHeight,
                drawWeekend: drawWeekend ?? timelineGrid.drawWeekend,
                drawHoliday: drawHoliday ?? timelineGrid.drawHoliday,
                weekendCellColor,
                holidayCellColor,
            });
        }

        const options = {
            ...drawProps,
            canvasHeight,
            height: canvasHeight,
            drawLine: drawLine ?? timelinePrimitives.drawVerticalLine,
            lineWidth: regularLineWidth,
        };

        if (timelineGrid.shouldDrawMinutes(pxPerDay)) {
            (drawMinutes ?? timelineGrid.drawMinutes)(options);
        }

        if (timelineGrid.shouldDrawQuarterHours(pxPerDay)
        ) {
            (drawQuarterHours ?? timelineGrid.drawQuarterHours)(options);
        }

        if (timelineGrid.shouldDrawHours(pxPerDay)) {
            (drawHours ?? timelineGrid.drawHours)(options);
        }

        if (timelineGrid.shouldDrawDays(pxPerDay)) {
            (drawDays ?? timelineGrid.drawDays)(options);
        }

        if (timelineGrid.shouldDrawWeeks(pxPerDay)) {
            (drawWeeks ?? timelineGrid.drawWeeks)(options);
        }

        if (timelineGrid.shouldDrawMonths(pxPerDay)) {
            (drawMonths ?? timelineGrid.drawMonths)(options);
        }

        (drawYears ?? timelineGrid.drawYears)(options);
        (drawToday ?? timelineGrid.drawToday)({ ...drawProps, todayLineColor, todayLineWidth });
    };

    return (
        <TimelineCanvas
            className={ restProps.className }
            draw={ restProps.draw ?? draw }
            canvasHeight={ canvasHeight }
            timelineController={ timelineController }
        />
    );
}

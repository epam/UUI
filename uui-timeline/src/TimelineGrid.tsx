import React from 'react';
import { TimelineTransform } from './TimelineTransform';
import { msPerDay } from './helpers';
import { Canvas, CanvasProps } from './Canvas';
import { CanvasDrawLineProps, CanvasDrawTimelineElementProps, timelineGrid } from './draw';

export interface TimelineGridProps extends CanvasProps {
    drawLine?: (props: CanvasDrawLineProps) => void;
    drawMinutes?: (props: CanvasDrawTimelineElementProps) => void;
    drawHours?: (props: CanvasDrawTimelineElementProps) => void;
    drawDays?: (props: CanvasDrawTimelineElementProps) => void;
    drawQuoterHours?: (props: CanvasDrawTimelineElementProps) => void;
    drawHolidays?: (props: CanvasDrawTimelineElementProps) => void;
    drawWeeks?: (props: CanvasDrawTimelineElementProps) => void;
    drawMonths?: (props: CanvasDrawTimelineElementProps) => void;
    drawYears?: (props: CanvasDrawTimelineElementProps) => void;
    drawToday?: (props: CanvasDrawTimelineElementProps) => void;
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
    ...restProps
}: TimelineGridProps) {
    const canvasHeight = restProps.canvasHeight ?? 60;

    const draw = (context: CanvasRenderingContext2D, timelineTransform: TimelineTransform) => {
        context.clearRect(0, 0, timelineTransform.widthPx, canvasHeight);
        context.strokeStyle = '#eee';

        const pxPerDay = timelineTransform.pxPerMs * msPerDay;

        const drawProps = { context, timelineTransform, canvasHeight };
        const customDrawProps = { ...drawProps, drawLine };
        if (pxPerDay >= 40000) {
            const options = drawMinutes ? drawProps : customDrawProps;
            (drawMinutes ?? timelineGrid.drawMinutes)(options);
        }

        if (pxPerDay >= 1600) {
            const options = drawQuoterHours ? drawProps : customDrawProps;
            (drawQuoterHours ?? timelineGrid.drawQuoterHours)(options);
        }

        if (pxPerDay >= 190) {
            const options = drawHours ? drawProps : customDrawProps;
            (drawHours ?? timelineGrid.drawHours)(options);
        }

        if (pxPerDay > 10) {
            const options = drawDays ? drawProps : customDrawProps;
            (drawDays ?? timelineGrid.drawDays)(options);
        }

        if (pxPerDay > 2 && pxPerDay < 200) {
            const options = drawHolidays ? drawProps : customDrawProps;
            (drawHolidays ?? timelineGrid.drawHolidays)(options);
        }

        if (pxPerDay > 2) {
            const options = drawWeeks ? drawProps : customDrawProps;
            (drawWeeks ?? timelineGrid.drawWeeks)(options);
        }

        if (pxPerDay > 0.5) {
            const options = drawWeeks ? drawProps : customDrawProps;
            (drawMonths ?? timelineGrid.drawMonths)(options);
        }

        const options = drawYears ? drawProps : customDrawProps;
        (drawYears ?? timelineGrid.drawYears)(options);
        (drawToday ?? timelineGrid.drawToday)(drawProps);
    };

    return (
        <Canvas
            draw={ restProps.draw ?? draw }
            canvasHeight={ canvasHeight }
            timelineController={ timelineController }
        />
    );
}

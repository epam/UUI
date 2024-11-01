import * as React from 'react';
import cx from 'classnames';
import { TimelineTransform } from './TimelineTransform';
import styles from './TimelineScale.module.scss';

import { ReactComponent as ArrowLeftSvg } from './arrowLeft.svg';
import { ReactComponent as ArrowRightSvg } from './arrowRight.svg';
import { Svg } from '@epam/uui-components';
import { useCallback, useEffect, useState } from 'react';
import { TimelineCanvas, TimelineCanvasProps } from './TimelineCanvas';
import { useTimelineTransform } from './useTimelineTransform';
import { CanvasDrawPeriodPartProps, CanvasDrawPeriodProps, CanvasDrawScaleBottomBorderProps, TimelineScaleFonts,
    timelineScale, CanvasDrawTopDaysProps, CanvasDrawDaysProps, CanvasDrawPeriodWithTodayProps, CanvasDrawHeaderTodayProps,
} from './draw';

/**
 * Timeline scale, which draws years/months/weeks/days/hours/minutes on the timeline header.
 */
export interface TimelineScaleProps extends TimelineCanvasProps, TimelineScaleFonts {
    /**
     * Enables changing time period via dragging of scale.
     */
    isDraggable?: boolean;
    /**
     * Enables changing time period/scale using wheel.
     */
    isScaleChangeOnWheel?: boolean;
    /**
     * Overrides bottom border color.
     */
    bottomBorderColor?: string;
    /**
     * Overrides date/time text color.
     */
    periodTextColor?: string;
    /**
     * Overrides day text color if day is on the top of a scale.
     */
    topDayTextColor?: string;
    /**
     * Overrides weekend text color.
     */
    weekendTextColor?: string;
    /**
     * Overrides bottom border line for current period (today, this week, etc).
     */
    todayLineColor?: string;
    /**
     * Overrides bottom border line width for current period (today, this week, etc).
     */
    todayLineWidth?: number;
    /**
     * Overrides period cell border color.
     */
    cellBorderColor?: string;
    /**
     * Overrides period cell border width.
     */
    cellBorderWidth?: number;
    /**
     * Overrides period cell background color.
     */
    cellBackgroundColor?: string;
    
    /**
     * Overrides cell background color of even month/year in the top position.
     */
    evenPeriodCellBackgroundColor?: string;
    /**
     * Overrides weekend/holiday cell background color.
     */
    weekendCellBackgroundColor?: string;
    /**
     * Overrides movement arrows icons.
     * @param direction - arrow direction.
     * @returns custom arrow icon for exact direction.
     */
    renderArrowIcon?: (direction: 'left' | 'right') => React.ReactNode;
    /**
     * Overrides movement arrows.
     * @param direction - arrow direction.
     * @returns custom arrow for exact direction.
     */
    renderArrow?: (direction: 'left' | 'right') => React.ReactNode;
    /**
     * Overrides bottom border of the scale.
     */
    drawScaleBottomBorder?: (props: CanvasDrawScaleBottomBorderProps) => void;
    /**
     * Overrides drawing minutes on the scale.
     */
    drawMinutes?: (props: CanvasDrawPeriodPartProps) => void;
    /**
     * Overrides drawing remaining hours on the scale.
     */
    drawRemainingHours?: (props: CanvasDrawPeriodPartProps) => void;
    /**
     * Overrides drawing hours on the scale.
     */
    drawHours?: (props: CanvasDrawPeriodPartProps) => void;
    /**
     * Overrides drawing days on the top of the scale.
     */
    drawTopDays?: (props: CanvasDrawTopDaysProps) => void;
    /**
     * Overrides drawing days on the scale.
     */
    drawDays?: (props: CanvasDrawDaysProps) => void;
    /**
     * Overrides drawing months on the top of the scale.
     */
    drawTopMonths?: (props: CanvasDrawPeriodPartProps) => void;
    /**
     * Overrides drawing weeks on the scale.
     */
    drawWeeks?: (props: CanvasDrawPeriodWithTodayProps) => void;
    /**
     * Overrides drawing months on the bottom of the scale.
     */
    drawBottomMonths?: (props: CanvasDrawPeriodWithTodayProps) => void;
    /**
     * Overrides drawing years on the scale.
     */
    drawYears?: (props: CanvasDrawPeriodWithTodayProps) => void;
    /**
     * Overrides drawing of the period text.
     */
    drawPeriod?: (props: CanvasDrawPeriodProps) => void;
    /**
     * Overrides drawing current period on the scale.
     */
    drawToday?: (props: CanvasDrawHeaderTodayProps) => void;
}

/**
 * Timeline scale with periods.
 */
export function TimelineScale({
    timelineController,
    isDraggable,
    isScaleChangeOnWheel,
    periodFont = timelineScale.defaultFonts.periodFont,
    currentPeriodFont = timelineScale.defaultFonts.currentPeriodFont,
    meridiemFont = timelineScale.defaultFonts.meridiemFont,
    periodTextColor = timelineScale.defaultColors.periodTextColor,
    bottomBorderColor = timelineScale.defaultColors.bottomBorderColor,
    topDayTextColor = timelineScale.defaultColors.topDayTextColor,
    weekendTextColor = timelineScale.defaultColors.weekendTextColor,
    todayLineColor = timelineScale.defaultColors.todayLineColor,
    todayLineWidth = timelineScale.defaultWidth.todayLineWidth,
    cellBorderColor = timelineScale.defaultColors.cellBorderColor,
    cellBorderWidth = timelineScale.defaultWidth.cellBorderWidth,
    cellBackgroundColor = timelineScale.defaultColors.cellBackgroundColor,
    evenPeriodCellBackgroundColor = timelineScale.defaultColors.evenPeriodCellBackgroundColor,
    weekendCellBackgroundColor = timelineScale.defaultColors.weekendCellBackgroundColor,

    drawPeriod = timelineScale.drawPeriod,
    drawMinutes = timelineScale.drawMinutes,
    drawRemainingHours = timelineScale.drawRemainingHours,
    drawHours = timelineScale.drawHours,
    drawTopDays = timelineScale.drawTopDays,
    drawDays = timelineScale.drawDays,
    drawTopMonths = timelineScale.drawTopMonths,
    drawWeeks = timelineScale.drawWeeks,
    drawBottomMonths = timelineScale.drawBottomMonths,
    drawYears = timelineScale.drawYears,
    drawToday = timelineScale.drawToday,
    drawScaleBottomBorder = timelineScale.drawScaleBottomBorder,
    ...props
}: TimelineScaleProps) {
    const [isMouseDown, setIsMouseDown] = useState(false);
    
    const handleWindowMouseUp = useCallback(() => {
        if (isMouseDown) {
            setIsMouseDown(false);
        }
    }, [isMouseDown, setIsMouseDown]);

    const timelineTransform = useTimelineTransform({ timelineController });

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        timelineController.startDrag(e);
        setIsMouseDown(true);
    }, [timelineController]);

    const handleWheel = (e: React.SyntheticEvent<HTMLCanvasElement>) => {
        timelineController.handleWheelEvent(e.nativeEvent as WheelEvent);
    };

    const renderArrowIcon = (direction: 'left' | 'right') => {
        const svg = direction === 'left' ? ArrowLeftSvg : ArrowRightSvg;
        return <Svg svg={ svg } cx={ styles.arrowIcon } />;
    };

    const renderArrow = (direction: 'left' | 'right') => {
        const handleClick = () => {
            timelineController.moveBy(direction === 'left' ? -1 : 1);
        };

        return (
            <div
                className={ cx(styles.arrow, direction == 'left' ? styles.arrowLeft : styles.arrowRight) }
                onClick={ handleClick }
            >
                {(props.renderArrowIcon ?? renderArrowIcon)(direction)}
            </div>
        );
    };

    const draw = (context: CanvasRenderingContext2D, t: TimelineTransform) => {
        const canvasHeight = 60;
        context.clearRect(0, 0, t.widthMs, canvasHeight);

        const fonts = { currentPeriodFont, periodFont, meridiemFont };
        const commonProps = {
            context,
            timelineTransform: t,
            periodTextColor,
            canvasHeight,
            cellBackgroundColor,
            ...fonts,
        };

        const withGridLinesProps = { ...commonProps, cellBorderColor, cellBorderWidth };
        const todayProps = { todayLineColor, todayLineWidth, drawToday };
        drawPeriod({ ...timelineScale.getMinutesScaleRange(), draw: drawMinutes, ...withGridLinesProps });
        drawPeriod({ ...timelineScale.getRemainingHoursScaleRange(), draw: drawRemainingHours, ...commonProps });
        drawPeriod({ ...timelineScale.getHoursScaleRange(), draw: (...props) => drawHours(...props), ...commonProps });
        drawPeriod({
            draw: (props) => drawTopDays({ ...props, topDayTextColor, weekendTextColor, weekendCellBackgroundColor, ...todayProps }),
            ...timelineScale.getTopDaysScaleRange(),
            ...withGridLinesProps,
        });
        drawPeriod({
            draw: (props) => drawDays({ ...props, weekendTextColor, weekendCellBackgroundColor, ...todayProps }),
            ...timelineScale.getDaysScaleRange(),
            ...withGridLinesProps,
        });
        drawPeriod({
            draw: (props) => drawTopMonths({ ...props, evenPeriodCellBackgroundColor }),
            ...timelineScale.getTopMonthsScaleRange(),
            ...withGridLinesProps,
        });
        drawPeriod({
            draw: (props) => drawWeeks({ ...props, drawToday, ...todayProps }),
            ...timelineScale.getWeeksScaleRange(),
            ...withGridLinesProps,
        });
        drawPeriod({
            draw: (props) => drawBottomMonths({ ...props, drawToday, ...todayProps }),
            ...timelineScale.getBottomMonthsScaleRange(),
            ...withGridLinesProps });
        drawPeriod({
            draw: (props) => drawYears({ ...props, drawToday, evenPeriodCellBackgroundColor, ...todayProps }),
            ...timelineScale.getYearsScaleRange(),
            ...withGridLinesProps,
        });

        drawScaleBottomBorder({ context, canvasHeight, timelineTransform: t, bottomBorderColor });
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleWindowMouseUp);
        
        return () => {
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [handleWindowMouseUp]);

    return (
        <div className={ styles.timelineHeader } style={ { width: timelineTransform.widthPx } }>
            {!isMouseDown && (props.renderArrow ?? renderArrow)('left')}
            {!isMouseDown && (props.renderArrow ?? renderArrow)('right')}
            <TimelineCanvas
                className={ isMouseDown ? styles.timelineScaleGrabbing : styles.timelineScale }
                onMouseDown={ isDraggable && handleMouseDown }
                onWheel={ isScaleChangeOnWheel && handleWheel }
                draw={ props.draw ?? draw }
                timelineController={ timelineController }
            />
        </div>
    );
}

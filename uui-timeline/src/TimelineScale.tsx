import * as React from 'react';
import cx from 'classnames';
import { TimelineTransform } from './TimelineTransform';
import styles from './TimelineScale.module.scss';

import { ReactComponent as ArrowLeftSvg } from './arrowLeft.svg';
import { ReactComponent as ArrowRightSvg } from './arrowRight.svg';
import { Svg } from '@epam/uui-components';
import { useCallback, useEffect, useRef } from 'react';
import { TimelineCanvas, TimelineCanvasProps } from './TimelineCanvas';
import { useTimelineTransform } from './useTimelineTransform';
import { CanvasDrawPeriodPartProps, CanvasDrawPeriodProps, CanvasDrawBottomBorderScaleProps, TimelineScaleFonts,
    timelineScale, CanvasDrawTopDaysProps, CanvasDrawDaysProps, CanvasDrawPeriodWithTodayProps, CanvasDrawHeaderTodayProps,
} from './draw';

export interface TimelineScaleProps extends TimelineCanvasProps, TimelineScaleFonts {
    isDraggable?: boolean;
    isScaleChangeOnWheel?: boolean;
    shiftPercent?: number;
    bottomBorderColor?: string;
    periodTextColor?: string;
    topDayTextColor?: string;
    weekendTextColor?: string;
    todayLineColor?: string;
    cellBorderColor?: string;
    cellBorderWidth?: number;
    cellBackgroundColor?: string;
    evenPeriodCellBackgroundColor?: string;
    weekendCellBackgroundColor?: string;

    renderArrowIcon?: (direction: 'left' | 'right') => React.ReactNode;
    renderArrow?: (direction: 'left' | 'right') => React.ReactNode;

    drawBottomBorderScale?: (props: CanvasDrawBottomBorderScaleProps) => void;
    drawMinutes?: (props: CanvasDrawPeriodPartProps) => void;
    drawRemainingHours?: (props: CanvasDrawPeriodPartProps) => void;
    drawHours?: (props: CanvasDrawPeriodPartProps) => void;
    drawTopDays?: (props: CanvasDrawTopDaysProps) => void;
    drawDays?: (props: CanvasDrawDaysProps) => void;
    drawTopMonths?: (props: CanvasDrawPeriodPartProps) => void;
    drawWeeks?: (props: CanvasDrawPeriodWithTodayProps) => void;
    drawBottomMonths?: (props: CanvasDrawPeriodWithTodayProps) => void;
    drawYears?: (props: CanvasDrawPeriodWithTodayProps) => void;
    drawPeriod?: (props: CanvasDrawPeriodProps) => void
    drawToday?: (props: CanvasDrawHeaderTodayProps) => void;
}

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
    drawBottomBorderScale = timelineScale.drawBottomBorderScale,
    ...props
}: TimelineScaleProps) {
    const isMouseDownRef = useRef(false);
    
    const handleWindowMouseUp = useCallback(() => {
        if (isMouseDownRef.current) {
            isMouseDownRef.current = false;
        }
    }, []);

    const timelineTransform = useTimelineTransform({ timelineController });

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        timelineController.startDrag(e);
        isMouseDownRef.current = true;
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

        drawBottomBorderScale({ context, canvasHeight, timelineTransform: t, bottomBorderColor });

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
        drawPeriod({ ...timelineScale.getMinutesScaleRange(), draw: drawMinutes, ...withGridLinesProps });
        drawPeriod({ ...timelineScale.getRemainingHoursScaleRange(), draw: drawRemainingHours, ...commonProps });
        drawPeriod({ ...timelineScale.getHoursScaleRange(), draw: (...props) => drawHours(...props), ...commonProps });
        drawPeriod({
            draw: (props) => drawTopDays({ ...props, topDayTextColor, weekendTextColor, todayLineColor, weekendCellBackgroundColor, drawToday }),
            ...timelineScale.getTopDaysScaleRange(),
            ...withGridLinesProps,
        });
        drawPeriod({
            draw: (props) => drawDays({ ...props, weekendTextColor, todayLineColor, weekendCellBackgroundColor, drawToday }),
            ...timelineScale.getDaysScaleRange(),
            ...withGridLinesProps,
        });
        drawPeriod({
            draw: (props) => drawTopMonths({ ...props, evenPeriodCellBackgroundColor }),
            ...timelineScale.getTopMonthsScaleRange(),
            ...withGridLinesProps,
        });
        drawPeriod({
            draw: (props) => drawWeeks({ ...props, todayLineColor, drawToday }),
            ...timelineScale.getWeeksScaleRange(),
            ...withGridLinesProps,
        });
        drawPeriod({
            draw: (props) => drawBottomMonths({ ...props, todayLineColor, drawToday }),
            ...timelineScale.getBottomMonthsScaleRange(),
            ...withGridLinesProps });
        drawPeriod({
            draw: (props) => drawYears({ ...props, todayLineColor, drawToday, evenPeriodCellBackgroundColor }),
            ...timelineScale.getYearsScaleRange(),
            ...withGridLinesProps,
        });
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleWindowMouseUp);
        
        return () => {
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [handleWindowMouseUp]);
  
    return (
        <div className={ styles.timelineHeader } style={ { width: timelineTransform.widthPx } }>
            {!isMouseDownRef.current && (props.renderArrow ?? renderArrow)('left')}
            {!isMouseDownRef.current && (props.renderArrow ?? renderArrow)('right')}
            <TimelineCanvas
                className={ isMouseDownRef.current ? styles.timelineScaleGrabbing : styles.timelineScale }
                onMouseDown={ isDraggable && handleMouseDown }
                onWheel={ isScaleChangeOnWheel && handleWheel }
                draw={ props.draw ?? draw }
                timelineController={ timelineController }
            />
        </div>
    );
}

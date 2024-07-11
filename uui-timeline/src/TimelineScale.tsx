import * as React from 'react';
import cx from 'classnames';
import { TimelineTransform } from './TimelineTransform';
import styles from './TimelineScale.module.scss';

import { ReactComponent as ArrowLeftSvg } from './arrowLeft.svg';
import { ReactComponent as ArrowRightSvg } from './arrowRight.svg';
import { Svg } from '@epam/uui-components';
import { useCallback, useEffect, useRef } from 'react';
import { Canvas, CanvasProps } from './Canvas';
import { useTimelineTransform } from './useTimelineTransform';
import { CanvasDrawPeriodPartProps, CanvasDrawPeriodProps, CanvasDrawBottomBorderScaleProps, TimelineScaleFonts,
    timelineScale, CanvasDrawTopDaysProps, CanvasDrawDaysProps, CanvasDrawPeriodWithTodayProps, CanvasDrawHeaderTodayProps,
} from './draw';

export interface TimelineScaleProps extends CanvasProps, TimelineScaleFonts {
    isDraggable?: boolean;
    isScaleChangeOnWheel?: boolean;
    shiftPercent?: number;
    bottomBorderColor?: string;
    periodTextColor?: string;
    topDayTextColor?: string;
    weekendTextColor?: string;
    todayLineColor?: string;

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
            ...fonts,
        };

        drawPeriod({ minPxPerDay: 40000, maxPxPerDay: null, draw: drawMinutes, ...commonProps });
        drawPeriod({ minPxPerDay: 800, maxPxPerDay: 40000, draw: drawRemainingHours, ...commonProps });
        drawPeriod({ minPxPerDay: 200, maxPxPerDay: 20000, draw: drawHours, ...commonProps });
        drawPeriod({
            minPxPerDay: 200,
            maxPxPerDay: null,
            draw: (props) => drawTopDays({ ...props, topDayTextColor, weekendTextColor, todayLineColor, drawToday }),
            ...commonProps,
        });
        drawPeriod({
            minPxPerDay: 20,
            maxPxPerDay: 200,
            draw: (props) => drawDays({ ...props, weekendTextColor, todayLineColor, drawToday }),
            ...commonProps,
        });
        drawPeriod({ minPxPerDay: 6, maxPxPerDay: 200, draw: drawTopMonths, ...commonProps });
        drawPeriod({ minPxPerDay: 6, maxPxPerDay: 20, draw: (props) => drawWeeks({ ...props, todayLineColor, drawToday }), ...commonProps });
        drawPeriod({ minPxPerDay: 1, maxPxPerDay: 6, draw: (props) => drawBottomMonths({ ...props, todayLineColor, drawToday }), ...commonProps });
        drawPeriod({ minPxPerDay: null, maxPxPerDay: 6, draw: (props) => drawYears({ ...props, todayLineColor, drawToday }), ...commonProps });
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
            <Canvas
                className={ isMouseDownRef.current ? styles.timelineScaleGrabbing : styles.timelineScale }
                onMouseDown={ isDraggable && handleMouseDown }
                onWheel={ isScaleChangeOnWheel && handleWheel }
                draw={ props.draw ?? draw }
                timelineController={ timelineController }
            />
        </div>
    );
}

import * as React from 'react';
import cx from 'classnames';
import { TimelineTransform } from './TimelineTransform';
import {
    addDays, months, getHoursInFormatAMPM,
} from './helpers';
import styles from './TimelineScale.module.scss';

import { ReactComponent as ArrowLeftSvg } from './arrowLeft.svg';
import { ReactComponent as ArrowRightSvg } from './arrowRight.svg';
import { Icon } from '@epam/uui-core';
import { Svg } from '@epam/uui-components';
import { useCallback, useEffect, useRef } from 'react';
import { Canvas, CanvasProps } from './Canvas';
import { useTimelineTransform } from './useTimelineTransform';

export interface TimelineScaleProps extends CanvasProps {
    isDraggable?: boolean;
    isScaleChangeOnWheel?: boolean;
    shiftPercent?: number;
}

const moveAmount = 0.7;

export function TimelineScale({ timelineController, isDraggable, isScaleChangeOnWheel, draw: propsDraw }: TimelineScaleProps) {
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

    const isCurrentPeriod = (leftDate: Date, rightDate: Date) => {
        return new Date() >= leftDate && new Date() <= rightDate;
    };

    const renderToday = (ctx: CanvasRenderingContext2D, leftDate: Date, rightDate: Date, x: number, width: number) => {
        if (isCurrentPeriod(leftDate, rightDate)) {
            ctx.fillStyle = '#F37B94';
            ctx.fillRect(x, 56, width, 4);
        }
    };

    const renderHeader = (
        ctx: CanvasRenderingContext2D,
        t: TimelineTransform,
        header: string,
        x: number,
        width: number,
        line: number,
        isCurPeriod: boolean,
        textColor: string = '#525462',
        visibility?: number,
        superscript?: string,
    ) => {
        ctx.fillStyle = textColor;

        const padding = 12;
        const headerTextWidth = ctx.measureText(header).width;
        const textWidth = headerTextWidth + padding * 2;
        const center = x + width / 2;
        let left = center - textWidth / 2;

        // Stick to the edges
        if (width > 120) {
            const leftBound = 24;
            const rightBound = t.widthPx - 24;
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

        ctx.font = isCurPeriod ? '14px Sans Semibold' : '14px Sans Regular';
        ctx.fillText(header, left + padding, line * 24);

        if (superscript) {
            ctx.font = '10px Sans Semibold';
            ctx.fillText(superscript, left + padding + headerTextWidth + 3, (line - 1) * 24 + 20);
        }
    };

    const renderPart = (
        ctx: CanvasRenderingContext2D,
        t: TimelineTransform,
        minPxPerDay: number,
        maxPxPerDay: number,
        render: (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => void,
    ) => {
        const visibility = t.getScaleVisibility(minPxPerDay, maxPxPerDay);

        if (!visibility) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = visibility;

        render(ctx, t, visibility);

        ctx.restore();
    };

    const renderMinutes = (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => {
        t.getVisibleMinutes().forEach((w) => {
            const header = w.leftDate.getHours().toString().padStart(2, '0') + ':' + w.leftDate.getMinutes().toString().padStart(2, '0');
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            renderHeader(ctx, t, header, w.left, w.right - w.left, 2 + (1 - visibility) * moveAmount, isCurPeriod, '#525462', visibility);
        });
    };

    const renderRemainingHours = (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => {
        t.getVisibleHours()
            .filter((i) => i.leftDate.getHours() % 3 !== 0)
            .forEach((w) => {
                const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
                const header = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
                const superscript = hoursInFormatAMPM.slice(-2);
                const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
                renderHeader(
                    ctx,
                    t,
                    header,
                    w.left - (w.right - w.left) / 2,
                    w.right - w.left,
                    2 + (1 - visibility) * moveAmount,
                    isCurPeriod,
                    '#525462',
                    null,
                    superscript,
                );
            });
    };

    const renderHours = (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => {
        t.getVisibleHours()
            .filter((i) => i.leftDate.getHours() % 3 === 0)
            .forEach((w) => {
                const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
                const header = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
                const superscript = hoursInFormatAMPM.slice(-2);
                const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
                renderHeader(
                    ctx,
                    t,
                    header,
                    w.left - (w.right - w.left) / 2,
                    w.right - w.left,
                    2 + (1 - visibility) * moveAmount,
                    isCurPeriod,
                    '#525462',
                    null,
                    superscript,
                );
            });
    };

    const renderTopDays = (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => {
        t.getVisibleDays().forEach((w) => {
            renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            const header = months[w.leftDate.getMonth()] + ' ' + w.leftDate.getDate().toString() + ', ' + w.leftDate.getFullYear();
            let textColor = '#2c2f3c';
            if (t.isWeekend(w.leftDate) || t.isHoliday(w.leftDate)) {
                textColor = '#F37B94';
            }
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            renderHeader(ctx, t, header.toUpperCase(), w.left, w.right - w.left, 1 - (1 - visibility) * moveAmount, isCurPeriod, textColor);
        });
    };

    const renderDays = (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => {
        t.getVisibleDays().forEach((w) => {
            renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            const header = w.leftDate.getDate().toString();
            let textColor;
            if (t.isWeekend(w.leftDate) || t.isHoliday(w.leftDate)) {
                textColor = '#F37B94';
            }
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            renderHeader(ctx, t, header, w.left, w.right - w.left, 2 + (1 - visibility) * moveAmount, isCurPeriod, textColor);
        });
    };

    const renderTopMonths = (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => {
        t.getVisibleMonths().forEach((w) => {
            const header = months[w.leftDate.getMonth()] + ' ' + w.leftDate.getFullYear();
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            renderHeader(ctx, t, header.toUpperCase(), w.left, w.right - w.left, 1 - (1 - visibility) * moveAmount, isCurPeriod);
        });
    };

    const renderWeeks = (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => {
        t.getVisibleWeeks().forEach((w) => {
            renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            const header = w.leftDate.getDate() + ' – ' + addDays(w.rightDate, -1).getDate();
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            renderHeader(ctx, t, header, w.left, w.right - w.left, 2 + (1 - visibility) * moveAmount, isCurPeriod);
        });
    };

    const renderBottomMonths = (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => {
        t.getVisibleMonths().forEach((w) => {
            renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            const header = months[w.leftDate.getMonth()].toString();
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            renderHeader(ctx, t, header, w.left, w.right - w.left, 2 + (1 - visibility) * moveAmount, isCurPeriod);
        });
    };

    const renderYears = (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => {
        const isBottom = t.getScaleVisibility(null, 1);
        t.getVisibleYears().forEach((w) => {
            isBottom && renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            const header = w.leftDate.getFullYear().toString();
            const isCurPeriod = isCurrentPeriod(w.leftDate, w.rightDate);
            renderHeader(ctx, t, header.toUpperCase(), w.left, w.right - w.left, visibility + isBottom, isCurPeriod);
        });
    };

    const renderArrow = (direction: 'left' | 'right') => {
        const handleClick = () => {
            timelineController.moveBy(direction === 'left' ? -1 : 1);
        };

        const renderArrowIcon = (svg: Icon) => {
            return <Svg svg={ svg } cx={ styles.arrowIcon } />;
        };

        return (
            <div className={ cx(styles.arrow, direction == 'left' ? styles.arrowLeft : styles.arrowRight) } onClick={ handleClick }>
                {renderArrowIcon(direction === 'left' ? ArrowLeftSvg : ArrowRightSvg)}
            </div>
        );
    };

    const draw = (ctx: CanvasRenderingContext2D, t: TimelineTransform) => {
        ctx.clearRect(0, 0, t.widthMs, 60);

        // bottom border scale
        ctx.strokeStyle = '#999';
        ctx.beginPath();
        ctx.moveTo(0, 60);
        ctx.lineTo(t.widthMs, 60);
        ctx.stroke();

        ctx.font = '12px Sans Regular';

        renderPart(ctx, t, 40000, null, renderMinutes);
        renderPart(ctx, t, 800, 40000, renderRemainingHours);
        renderPart(ctx, t, 200, 20000, renderHours);
        renderPart(ctx, t, 200, null, renderTopDays);
        renderPart(ctx, t, 20, 200, renderDays);
        renderPart(ctx, t, 6, 200, renderTopMonths);
        renderPart(ctx, t, 6, 20, renderWeeks);
        renderPart(ctx, t, 1, 6, renderBottomMonths);
        renderPart(ctx, t, null, 6, renderYears);
    };
    
    useEffect(() => {
        window.addEventListener('mouseup', handleWindowMouseUp);
        
        return () => {
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [handleWindowMouseUp]);
  
    return (
        <div className={ styles.timelineHeader } style={ { width: timelineTransform.widthPx } }>
            {!isMouseDownRef.current && renderArrow('left')}
            {!isMouseDownRef.current && renderArrow('right')}
            <Canvas
                className={ isMouseDownRef.current ? styles.timelineScaleGrabbing : styles.timelineScale }
                onMouseDown={ isDraggable && handleMouseDown }
                onWheel={ isScaleChangeOnWheel && handleWheel }
                draw={ propsDraw ?? draw }
                timelineController={ timelineController }
            />
        </div>
    );
}

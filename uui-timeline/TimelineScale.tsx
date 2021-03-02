import * as React from 'react';
import cx from 'classnames';
import { TimelineTransform } from './TimelineTransform';
import { BaseTimelineCanvasComponent, BaseTimelineCanvasComponentProps } from './BaseTimelineCanvasComponent';
import { addDays, isWeekend, months, msPerDay, Scales, getHoursInFormatAMPM } from './helpers';
import * as styles from './TimelineScale.scss';

import * as arrowLeftSvg from './arrowLeft.svg';
import * as arrowRightSvg from './arrowRight.svg';
import { Icon } from '@epam/uui';
import { Svg } from '@epam/uui-components';

export interface TimelineScaleProps extends BaseTimelineCanvasComponentProps {
    isDraggable?: boolean;
    isScaleChangeOnWheel?: boolean;
    shiftPercent?: number;
}

const moveAmount = 0.7;

export class TimelineScale extends BaseTimelineCanvasComponent<TimelineScaleProps, {}> {

    private isMouseDown: boolean = false;

    componentDidMount() {
        super.componentDidMount();
        window.addEventListener('mouseup', this.handleWindowMouseUp);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        window.removeEventListener('mouseup', this.handleWindowMouseUp);
    }

    private handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        this.props.timelineController.startDrag(e);
        this.isMouseDown = true;
        this.forceUpdate();
    }

    private handleWindowMouseUp = () => {
        if (this.isMouseDown) {
            this.isMouseDown = false;
            this.forceUpdate();
        }
    }

    private handleWheel = (e: React.SyntheticEvent<HTMLCanvasElement>) => {
        this.props.timelineController.handleWheelEvent(e.nativeEvent as WheelEvent);
    }

    private isCurrentPeriod(leftDate: Date, rightDate: Date) {
        return new Date() >= leftDate && new Date() <= rightDate;
    }

    private renderToday(ctx: CanvasRenderingContext2D, leftDate: Date, rightDate: Date, x: number, width: number) {
        if (this.isCurrentPeriod(leftDate, rightDate)) {
            ctx.fillStyle = '#F37B94';
            ctx.fillRect(x, 56, width, 4);
        }
    }

    private renderHeader(
      ctx: CanvasRenderingContext2D,
      t: TimelineTransform,
      header: string,
      x: number,
      width: number,
      line: number,
      isCurrentPeriod: boolean,
      textColor: string = '#525462',
      visibility?: number,
      superscript?: string,
    ) {
        ctx.fillStyle = textColor;
        const padding = 12;
        const headerTextWidth = ctx.measureText(header).width;
        const textWidth = headerTextWidth + padding * 2;
        const center = x + width / 2;
        let left = center - textWidth / 2;
        if (width > 120) {
            if (left < 0) {
                left = 0;
            }
            if ((left + textWidth) > t.widthPx) {
                left = t.widthPx - textWidth;
            }
            if (left < x) {
                left = x;
            }
            if (left + textWidth > x + width) {
                left = x + width - textWidth;
            }
        }

        isCurrentPeriod ? ctx.font = '14px Sans Semibold' : ctx.font = '14px Sans Regular';
        ctx.fillText(header, left + padding, line * 24);

        if (superscript) {
            ctx.font = '10px Sans Semibold';
            ctx.fillText(superscript, left + padding + headerTextWidth + 3, ((line - 1) * 24) + 20);
        }
    }

    private renderPart(
      ctx: CanvasRenderingContext2D,
      t: TimelineTransform,
      minPxPerDay: number,
      maxPxPerDay: number,
      render: (ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) => void,
    ) {
        const visibility = t.getScaleVisibility(minPxPerDay, maxPxPerDay);

        if (visibility == 0) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = visibility;

        render.call(this, ctx, t, visibility);

        ctx.restore();
    }

    private renderRemainingHours(ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) {
        t.getVisibleHours().filter(i => i.leftDate.getHours() % 3 !== 0).map(w => {
            const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
            const header = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
            const superscript = hoursInFormatAMPM.slice(-2);
            const isCurrentPeriod = this.isCurrentPeriod(w.leftDate, w.rightDate);
            this.renderHeader(ctx, t, header, w.left - (w.right - w.left) / 2, w.right - w.left, 2 + (1 - visibility) * moveAmount, isCurrentPeriod, '#525462', null, superscript);
        });
    }

    private renderHours(ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) {
        t.getVisibleHours().filter(i => i.leftDate.getHours() % 3 === 0).map(w => {
            const hoursInFormatAMPM = getHoursInFormatAMPM(w.leftDate);
            const header = hoursInFormatAMPM.length === 4 ? hoursInFormatAMPM.slice(0, 1) : hoursInFormatAMPM.slice(0, 2);
            const superscript = hoursInFormatAMPM.slice(-2);
            const isCurrentPeriod = this.isCurrentPeriod(w.leftDate, w.rightDate);
            this.renderHeader(ctx, t, header, w.left - (w.right - w.left) / 2, w.right - w.left, 2 + (1 - visibility) * moveAmount, isCurrentPeriod, '#525462', null, superscript);
        });
    }

    private renderTopDays(ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) {
        t.getVisibleDays().map(w => {
            this.renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            const header = months[w.leftDate.getMonth()] + " " + w.leftDate.getDate().toString() + ", " + w.leftDate.getFullYear();
            let textColor = '#2c2f3c';
            if (t.isWeekend(w.leftDate) || t.isHoliday(w.leftDate)) {
                textColor = '#F37B94';
            }
            const isCurrentPeriod = this.isCurrentPeriod(w.leftDate, w.rightDate);
            this.renderHeader(ctx, t, header.toUpperCase(), w.left, w.right - w.left, 1 - (1 - visibility) * moveAmount, isCurrentPeriod, textColor);
        });
    }

    private renderDays(ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) {
        t.getVisibleDays().map(w => {
            this.renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            let header = w.leftDate.getDate().toString();
            let textColor;
            if (t.isWeekend(w.leftDate) || t.isHoliday(w.leftDate)) {
                textColor = '#F37B94';
            }
            let isCurrentPeriod = this.isCurrentPeriod(w.leftDate, w.rightDate);
            this.renderHeader(ctx, t, header, w.left, w.right - w.left, 2 + (1 - visibility) * moveAmount, isCurrentPeriod, textColor);
        });
    }

    private renderTopMonths(ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) {
        t.getVisibleMonths().map(w => {
            let header = months[w.leftDate.getMonth()] + " " + w.leftDate.getFullYear();
            let isCurrentPeriod = this.isCurrentPeriod(w.leftDate, w.rightDate);
            this.renderHeader(ctx, t, header.toUpperCase(), w.left, w.right - w.left, 1 - (1 - visibility) * moveAmount, isCurrentPeriod);
        });
    }

    private renderWeeks(ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) {
        t.getVisibleWeeks().map(w => {
            this.renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            let header = w.leftDate.getDate() + " – " + addDays(w.rightDate, -1).getDate();
            let isCurrentPeriod = this.isCurrentPeriod(w.leftDate, w.rightDate);
            this.renderHeader(ctx, t, header, w.left, w.right - w.left, 2 + (1 - visibility) * moveAmount, isCurrentPeriod);
        });
    }

    private renderBottomMonths(ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) {
        t.getVisibleMonths().map(w => {
            this.renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            let header = months[w.leftDate.getMonth()].toString();
            let isCurrentPeriod = this.isCurrentPeriod(w.leftDate, w.rightDate);
            this.renderHeader(ctx, t, header, w.left, w.right - w.left, 2 + (1 - visibility) * moveAmount, isCurrentPeriod);
        });
    }

    private renderYears(ctx: CanvasRenderingContext2D, t: TimelineTransform, visibility: number) {
        const isBottom = t.getScaleVisibility(null, 1);
        t.getVisibleYears().map(w => {
            isBottom && this.renderToday(ctx, w.leftDate, w.rightDate, w.left, w.right - w.left);
            let header = w.leftDate.getFullYear().toString();
            let isCurrentPeriod = this.isCurrentPeriod(w.leftDate, w.rightDate);
            this.renderHeader(ctx, t, header.toUpperCase(), w.left, w.right - w.left, visibility + isBottom, isCurrentPeriod);
        });
    }

    private renderArrow(direction: 'left' | 'right') {
        let handleClick = () => {
            this.props.timelineController.moveBy(direction == 'left' ? -1 : 1);
        };

        let renderArrowIcon = (svg: Icon) => {
            return <Svg svg={ svg } cx={ styles.arrowIcon }/>;
        };

        return (
        <div
          className={ cx(styles.arrow, direction == 'left' ? styles.arrowLeft : styles.arrowRight) }
          onClick={ handleClick }
        >
          { renderArrowIcon(direction == 'left' ? arrowLeftSvg : arrowRightSvg) }
        </div>
        );
    }

    protected renderCanvas(ctx: CanvasRenderingContext2D, t: TimelineTransform): void {
        let maxWidth = window.outerWidth;

        ctx.clearRect(0, 0, maxWidth, 60);

        // bottom border scale
        ctx.strokeStyle = "#999";
        ctx.beginPath();
        ctx.moveTo(0, 60);
        ctx.lineTo(maxWidth, 60);
        ctx.stroke();

        ctx.font = '12px Sans Regular';

        this.renderPart(ctx, t, 800, null, this.renderRemainingHours);
        this.renderPart(ctx, t, 200, null, this.renderHours);
        this.renderPart(ctx, t, 200, null, this.renderTopDays);
        this.renderPart(ctx, t, 20, 200, this.renderDays);
        this.renderPart(ctx, t, 6, 200, this.renderTopMonths);
        this.renderPart(ctx, t, 6, 20, this.renderWeeks);
        this.renderPart(ctx, t, 1, 6, this.renderBottomMonths);
        this.renderPart(ctx, t, null, 6, this.renderYears);
    }

    public render() {
        return (
        <div className={ styles.timelineHeader } style={ {width: this.props.timelineController.currentViewport.widthPx} }>
          { !this.isMouseDown && this.renderArrow('left') }
          { !this.isMouseDown && this.renderArrow('right') }
          { this.renderCanvasElement({
              className: this.isMouseDown ? styles.timelineScaleGrabbing : styles.timelineScale,
              onMouseDown: this.props.isDraggable && this.handleMouseDown,
              onWheel: this.props.isScaleChangeOnWheel && this.handleWheel,
          }) }
        </div>
        );
    }
}
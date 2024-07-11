import { ScaleBar, TimelineTransform } from '../TimelineTransform';

export interface CanvasDrawProps {
    context: CanvasRenderingContext2D;
}

export interface CommonCanvasDrawProps extends CanvasDrawProps {
    canvasHeight?: number;
}

export interface CanvasDrawLineProps extends CommonCanvasDrawProps {
    x: number;
    width?: number;
}

export interface CanvasDrawHeaderTodayProps extends CanvasDrawProps {
    scaleBar: ScaleBar;
}

export interface CanvasDrawTimelineHeaderProps extends CanvasDrawProps {
    timelineTransform: TimelineTransform;
}

export interface CanvasDrawTimelineElementProps extends CommonCanvasDrawProps {
    timelineTransform: TimelineTransform;
}

export interface CustomCanvasDrawTimelineElementProps extends CanvasDrawTimelineElementProps {
    drawLine?: (props: CanvasDrawLineProps) => void;
}

export interface CanvasDrawHolidayProps extends CanvasDrawLineProps, CanvasDrawTimelineElementProps {
    date: Date;
}

export interface CanvasDrawHolidaysProps extends CanvasDrawTimelineElementProps {
    drawHolidayOrWeekend?: (props: CanvasDrawHolidayProps) => void;
}

export interface TimelineScaleFonts {
    /**
     * AM/PM symbols font.
     * @default '10px Sans Semibold'
     */
    meridiemFont?: string;
    /**
     * Years/months/days/hours/minutes font, except current one.
     * @default '14px Sans Regular'
     */
    periodFont?: string;
    /**
     * Current Year/month/group of days/day/time font.
     * @default '14px Sans Semibold'
     */
    currentPeriodFont?: string;
}

export interface CanvasDrawPeriodPartProps extends CanvasDrawTimelineHeaderProps, Required<TimelineScaleFonts> {
    visibility: number;
}

export interface CanvasDrawPeriodProps extends CanvasDrawTimelineHeaderProps, Required<TimelineScaleFonts> {
    minPxPerDay: number;
    maxPxPerDay: number;
    draw: (props: CanvasDrawPeriodPartProps) => void;
}

export interface CanvasDrawPeriodFragmentProps extends CanvasDrawTimelineHeaderProps, Required<TimelineScaleFonts> {
    text: string;
    textColor?: string;
    x: number;
    width: number;
    line: number;
    isCurPeriod: boolean,
    superscript?: string,
}

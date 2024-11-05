import { ScaleBar, TimelineTransform } from '../TimelineTransform';

export interface CanvasDrawProps {
    /**
     * Rendering context of canvas element.
     */
    context: CanvasRenderingContext2D;
}

export interface CommonCanvasDrawProps extends CanvasDrawProps {}

export interface CanvasDrawCellProps extends CommonCanvasDrawProps {
    x: number;
    width?: number;
    height?: number;
}

export interface CanvasDrawLineProps extends CommonCanvasDrawProps {
    width?: number;
    color?: string | CanvasGradient;
}

export interface CanvasDrawVerticalLineProps extends CanvasDrawLineProps {
    x: number;
    y1?: number;
    y2: number;
}

export interface CanvasDrawHorizontalLineProps extends CanvasDrawLineProps {
    x1?: number;
    x2: number;
    y: number;
}

export interface CanvasDrawRectangleProps extends CanvasDrawLineProps {
    x: number;
    y: number;
    width?: number;
    height: number;
}

export interface CanvasDrawHeaderTodayProps extends CanvasDrawProps {
    scaleBar: ScaleBar;
    canvasHeight?: number;
    todayLineColor?: string;
    todayLineHeight?: number;
}

export interface CanvasDrawTimelineHeaderProps extends CanvasDrawProps {
    timelineTransform: TimelineTransform;
    canvasHeight?: number;
}

export interface CanvasDrawTimelineElementProps extends CommonCanvasDrawProps {
    timelineTransform: TimelineTransform;
    canvasHeight?: number;
}

export interface CanvasDrawGridTodayLineProps extends CanvasDrawTimelineElementProps {
    todayLineColor?: string;
    todayLineWidth?: number;
}

export interface CanvasDrawScaleBottomBorderProps extends CanvasDrawTimelineElementProps {
    bottomBorderColor: string;
}

export interface CustomCanvasDrawTimelineElementProps extends CanvasDrawTimelineElementProps {
    drawLine?: (props: CanvasDrawVerticalLineProps) => void;
    lineWidth?: number;
}

export interface CanvasDrawHolidayProps extends CanvasDrawCellProps {
    holidayCellColor?: string;
}

export interface CanvasDrawWeekendProps extends CanvasDrawCellProps {
    weekendCellColor?: string;
}

export interface CanvasDrawHolidayOrWeekendProps extends CanvasDrawWeekendProps, CanvasDrawHolidayProps, CanvasDrawTimelineElementProps {
    date: Date;
    drawHoliday?: (props: CanvasDrawHolidayProps) => void;
    drawWeekend?: (props: CanvasDrawWeekendProps) => void;
}

export interface CanvasDrawHolidaysProps extends CanvasDrawTimelineElementProps {
    drawHolidayOrWeekend?: (props: CanvasDrawHolidayOrWeekendProps) => void;
    drawHoliday?: (props: CanvasDrawHolidayProps) => void;
    drawWeekend?: (props: CanvasDrawWeekendProps) => void;
    weekendCellColor?: string;
    holidayCellColor?: string;
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
     * Current Year/month/group of days/day/hours/minutes font.
     * @default '14px Sans Semibold'
     */
    currentPeriodFont?: string;
}

export interface CanvasDrawPeriodPartProps extends CanvasDrawTimelineHeaderProps, TimelineScaleFonts {
    visibility: number;
    periodTextColor?: string;
    cellBorderWidth?: number;
    cellBorderColor?: string;
    cellBackgroundColor?: string;
    evenPeriodCellBackgroundColor?: string;
    weekendCellBackgroundColor?: string;
}

export interface CanvasDrawPeriodWithTodayProps extends CanvasDrawPeriodPartProps {
    todayLineColor?: string;
    todayLineHeight: number;
    drawToday?: (props: CanvasDrawHeaderTodayProps) => void;
}

export interface CanvasDrawBottomMonthProps extends CanvasDrawPeriodWithTodayProps {
    getBottomMonth?: (month: number) => string;
}

export interface CanvasDrawTopMonthProps extends CanvasDrawPeriodPartProps {
    getTopMonth?: (month: number) => string;
}

export interface CanvasDrawDaysProps extends CanvasDrawPeriodPartProps, CanvasDrawPeriodWithTodayProps {
    weekendTextColor?: string;
    weekendCellBackgroundColor?: string;
}

export interface CanvasDrawTopDaysProps extends CanvasDrawDaysProps, CanvasDrawPeriodWithTodayProps {
    topDayTextColor?: string;
    getTopMonth?: (month: number) => string;
}

export interface CanvasScaleRange {
    minPxPerDay: number | null;
    maxPxPerDay: number | null;
}

export interface CanvasDrawPeriodProps extends
    CanvasDrawTimelineHeaderProps,
    TimelineScaleFonts,
    CanvasScaleRange {
    draw: (props: CanvasDrawPeriodPartProps) => void;
}

export interface CanvasDrawPeriodFragmentProps extends CanvasDrawTimelineHeaderProps, TimelineScaleFonts {
    text: string;
    textColor?: string;
    x: number;
    width: number;
    line: number;
    isCurPeriod: boolean,
    superscript?: string,
}

export interface CanvasDrawBorderForTopCell extends CanvasDrawProps {
    canvasHeight?: number;
    scaleBar: ScaleBar;
    width?: number;
    color?: string;
}

export interface CanvasDrawCellBackground extends CanvasDrawProps {
    canvasHeight?: number;
    scaleBar: ScaleBar;
    y?: number;
    color?: string;
    height?: number;
}

export interface CanvasDrawBottomGridLine extends CanvasDrawProps {
    canvasHeight?: number;
    scaleBar: ScaleBar;
    width?: number;
    color?: string;
}

export interface CanvasDrawWeekendHoursCell extends CanvasDrawTimelineElementProps {
    scaleBar: ScaleBar;
    cellBackgroundColor?: string;
    weekendCellBackgroundColor?: string;
}

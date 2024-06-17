import { i18n } from './i18n';

export const baseDate = new Date(2000, 1, 1);
export const msPerMinute = 60 /* sec */ * 1000; /* ms */
export const msPerHour = 60 /* min */ * msPerMinute;
export const msPerDay = 24 /* hour */ * msPerHour;
export const msPerYear = 365 * msPerDay;

const msPerMonth = 30 * msPerDay;
const msPerWeak = 7 * msPerDay;

export function addMs(date: Date, ms: number) {
    return new Date(date.getTime() + ms);
}

export function addDays(date: Date, days: number) {
    return new Date(date.getTime() + days * msPerDay);
}

export function isWeekend(date: Date) {
    return date.getDay() == 0 || date.getDay() == 6;
}

export function includeLastDay(date: Date) {
    return new Date(addDays(date, 1).getTime() - 1);
}

export function roundDateToMidday(date: Date) {
    date && date.setHours(12, 0, 0, 0);
    return date;
}

export function getHoursInFormatAMPM(date: Date) {
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours} ${ampm}`;
}

export function getleftXforCentering(stageSegment: any, textWidth: number, padding: number = 0) {
    if (textWidth + padding * 2 >= stageSegment.width) {
        return null;
    }

    let left = stageSegment.left + stageSegment.width / 2 - textWidth / 2;

    if (left < stageSegment.leftTrimmed + padding) {
        left = stageSegment.leftTrimmed + padding;
    }

    let leftX = left;
    const trimmedOnlyLeft = stageSegment.left != stageSegment.leftTrimmed && stageSegment.right == stageSegment.rightTrimmed;

    if (left + textWidth + padding > stageSegment.rightTrimmed && !trimmedOnlyLeft) {
        leftX = stageSegment.rightTrimmed - textWidth - padding;
    }

    if (left + textWidth + padding > stageSegment.rightTrimmed && trimmedOnlyLeft) {
        leftX = stageSegment.rightTrimmed - textWidth - padding;
    }

    if (stageSegment.left + textWidth + padding * 2 > stageSegment.rightTrimmed) {
        leftX = stageSegment.left + padding;
    }

    return leftX;
}

export const getScaleByRange = (range: number) => {
    const periodToScales: Array<[number, number[]]> = [
        [msPerYear, [scales.year, scales.yearWide]],
        [msPerMonth, [scales.month, scales.monthWide]],
        [msPerWeak, [scales.week, scales.weekWide]],
        [msPerDay, [scales.day, scales.dayWide]],
        [msPerHour, [scales.hour, scales.hourWide]],
        [msPerMinute, [scales.minute, scales.minuteWide]],
    ];

    for (const [index, [period, [gtScale, lteScale]]] of periodToScales.entries()) {
        if (range > period) {
            return gtScale;
        }

        const isLastScale = index === periodToScales.length - 1;
        if (range === period || isLastScale) {
            return lteScale;
        }

        const [nextPeriod] = periodToScales[index + 1];

        if (Math.abs(period - range) <= Math.abs(nextPeriod - range)) {
            return lteScale;
        }
    }
};

export const months = i18n.months;

export enum Scales {
    Year,
    Month,
    Week,
    Day,
    Hour,
    Minute
}

export let scaleSteps: Scales[] = [];

/** Pre-defined scales in px/millisecond.
 * Scales are picked by hand to make scale and grid fit fine, and transitions between different variants occurs in between of this scales */
// the logic under expressions below is: we take required pixels per scale unit (year, month,...), and divide it by milliseconds in this period.
// In term of units, this is: (px/duration)/(ms/duration) = (px*duration)/(ms*duration) = px/ms
export const scales = {
    year: 70 / msPerYear,
    yearWide: 200 / msPerYear,
    month: 40 / (30 * msPerDay),
    monthWide: 110 / (30 * msPerDay),
    week: 50 / (7 * msPerDay),
    weekWide: 80 / (7 * msPerDay),
    day: 24 / msPerDay,
    dayWide: 300 / msPerDay,
    hour: 37 / msPerHour, // ok
    hourWide: 300 / msPerHour,
    minute: 60 / msPerMinute,
    minuteWide: 120 / msPerMinute,
};

scaleSteps = [
    scales.year, scales.yearWide, scales.month, scales.monthWide, scales.week, scales.weekWide, scales.day, scales.dayWide, scales.hour, scales.hourWide, scales.minute,
    // scales.minuteWide
];

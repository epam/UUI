import { i18n } from "./i18n";

export let baseDate = new Date(2000, 1, 1);
export let msPerDay = 24 /*hour*/ * 60 /*min*/ * 60 /*sec*/ * 1000 /*ms*/;

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
    let trimmedOnlyLeft = stageSegment.left != stageSegment.leftTrimmed && stageSegment.right == stageSegment.rightTrimmed;

    if ((left + textWidth + padding) > stageSegment.rightTrimmed  && !trimmedOnlyLeft) {
        leftX = stageSegment.rightTrimmed - textWidth - padding;
    }

    if ((left + textWidth + padding) > stageSegment.rightTrimmed && trimmedOnlyLeft) {
        leftX = stageSegment.rightTrimmed - textWidth - padding;
    }

    if ((stageSegment.left + textWidth + padding * 2) > stageSegment.rightTrimmed) {
        leftX = stageSegment.left + padding;
    }

    return leftX;
}

export let months = i18n.months;

export enum Scales {
    Year,
    Month,
    Week,
    Day,
}

export let scaleSteps: Scales[] = [];

export let scales = {
    year: 2.3148148148148148e-9,
    month: 1.4157196863058943e-8,
    week: 7.875925925925926e-8,
    day: 2.71738085369666e-7,
    hour: 1.041666666666667e-5,
};

scaleSteps = [
    scales.year,
    6.004033472453708e-9,
    scales.month,
    4.0431348369849744e-8,
    scales.week,
    1.3888888888888888e-7,
    scales.day,
    3.472222222222222e-6,
    scales.hour,
];
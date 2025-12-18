import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import utc from 'dayjs/plugin/utc';

export type { Dayjs } from 'dayjs';

export const uuiDayjs = TREE_SHAKEABLE_INIT();

function TREE_SHAKEABLE_INIT() {
    let extended = false;
    return {
        get dayjs() {
            if (!extended) {
                dayjs.extend(isBetween);
                dayjs.extend(customParseFormat);
                dayjs.extend(utc);
                extended = true;
            }
            return dayjs;
        },
    };
}

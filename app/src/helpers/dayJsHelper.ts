import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

export type { Dayjs } from 'dayjs';

export const uuiDayjs = TREE_SHAKEABLE_INIT();

function TREE_SHAKEABLE_INIT() {
    let extended = false;
    return {
        get dayjs() {
            if (!extended) {
                dayjs.extend(isBetween);
                dayjs.extend(customParseFormat);
                extended = true;
            }
            return dayjs;
        },
    };
}

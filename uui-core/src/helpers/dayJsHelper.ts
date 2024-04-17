import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

export type { Dayjs } from 'dayjs';

export const dayJsHelper = pureFunction();

function pureFunction() {
    let extended = false;
    return {
        get dayjs() {
            if (!extended) {
                dayjs.extend(isSameOrBefore);
                dayjs.extend(isSameOrAfter);
                extended = true;
            }
            return dayjs;
        },
    };
}

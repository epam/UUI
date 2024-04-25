/* eslint-disable no-restricted-imports */
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

export type { Dayjs } from 'dayjs';

export const uuiDayjs = TREE_SHAKEABLE_INIT();

function TREE_SHAKEABLE_INIT() {
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

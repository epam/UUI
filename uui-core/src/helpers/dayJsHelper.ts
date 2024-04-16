import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

export type { Dayjs } from 'dayjs';

let extended = false;
export const dayJsHelper = /* @__PURE__ */{
    get dayjs() {
        if (!extended) {
            dayjs.extend(isSameOrBefore);
            dayjs.extend(isSameOrAfter);
            extended = true;
        }
        return dayjs;
    },
};

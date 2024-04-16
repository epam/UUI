import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import localeData from 'dayjs/plugin/localeData.js';
import isToday from 'dayjs/plugin/isToday.js';
import updateLocale from 'dayjs/plugin/updateLocale.js';

export type { Dayjs } from 'dayjs';

let extended = false;
export const dayJsHelper = /* @__PURE__ */{
    get dayjs() {
        if (!extended) {
            dayjs.extend(isSameOrBefore);
            dayjs.extend(isSameOrAfter);
            //
            dayjs.extend(localeData);
            dayjs.extend(isToday);
            dayjs.extend(updateLocale);
            extended = true;
        }
        return dayjs;
    },
};

/* eslint-disable no-restricted-imports */
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import localeData from 'dayjs/plugin/localeData.js';
import isToday from 'dayjs/plugin/isToday.js';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import { i18n } from '../i18n';

export type { Dayjs } from 'dayjs';

export const uuiDayjs = TREE_SHAKEABLE_INIT();

function TREE_SHAKEABLE_INIT() {
    let extended = false;
    return {
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

            if (dayjs.locale() !== i18n.datePicker.locale) {
                dayjs.locale(i18n.datePicker.locale);
            }

            /**
             * Currently, locales which starts from Sunday used.
             * That is why it's safe to set weekStart: 1 for all locales to start for Monday
             */
            if (dayjs.localeData().firstDayOfWeek() !== 1) {
                dayjs.updateLocale(i18n.datePicker.locale, {
                    weekStart: 1,
                });
            }

            return dayjs;
        },
    };
}

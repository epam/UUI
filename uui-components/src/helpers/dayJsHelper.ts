import dayjsOrig, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import isToday from 'dayjs/plugin/isToday';

let _extended = false;
const dayjs = ((...args: any[]) => {
    if (!_extended) {
        dayjsOrig.extend(localeData);
        dayjsOrig.extend(updateLocale);
        dayjsOrig.extend(isToday);
        _extended = true;
    }
    return dayjsOrig(...args);
}) as typeof dayjsOrig;

export { dayjs, Dayjs };

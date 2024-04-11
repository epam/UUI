import dayjsOrig, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import objectSupport from 'dayjs/plugin/objectSupport';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek.js';

let _extended = false;
const dayjs = Object.assign((...args: any[]) => {
    if (!_extended) {
        dayjs.extend(customParseFormat);
        dayjs.extend(objectSupport);
        dayjs.extend(updateLocale);
        dayjs.extend(localeData);
        dayjs.extend(isoWeek);
        _extended = true;
    }
    return dayjsOrig(...args);
}, dayjsOrig) as typeof dayjsOrig;

export { dayjs, type Dayjs };

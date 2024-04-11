import dayjsOrig, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import objectSupport from 'dayjs/plugin/objectSupport';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek.js';

let _isReady = false;
function _initDayJs() {
    if (!_isReady) {
        dayjsOrig.extend(customParseFormat);
        dayjsOrig.extend(objectSupport);
        dayjsOrig.extend(updateLocale);
        dayjsOrig.extend(localeData);
        dayjsOrig.extend(isoWeek);
        _isReady = true;
    }
}

function wrap() {
    return new Proxy(
        dayjsOrig,
        {
            get(_, prop) {
                _initDayJs();
                return dayjsOrig[prop as keyof typeof dayjsOrig];
            },
            apply(_, __, args) {
                _initDayJs();
                return dayjsOrig(...args);
            },
        },
    );
}

const dayjs = /* @__PURE__ */wrap();

export { dayjs, type Dayjs };

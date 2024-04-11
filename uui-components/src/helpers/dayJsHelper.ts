import dayjsOrig, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import isToday from 'dayjs/plugin/isToday';

let _isReady = false;
function _initDayJs() {
    if (!_isReady) {
        dayjsOrig.extend(localeData);
        dayjsOrig.extend(updateLocale);
        dayjsOrig.extend(isToday);
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

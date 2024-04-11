import dayjsOrig, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

let _isReady = false;
function _initDayJs() {
    if (!_isReady) {
        dayjsOrig.extend(isSameOrBefore);
        dayjsOrig.extend(isSameOrAfter);
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

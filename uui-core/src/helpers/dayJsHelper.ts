import dayjsOrig, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

let _extended = false;
const dayjs = ((...args: any[]) => {
    if (!_extended) {
        dayjsOrig.extend(isSameOrBefore);
        dayjsOrig.extend(isSameOrAfter);
        _extended = true;
    }
    return dayjsOrig(...args);
}) as typeof dayjsOrig;

export { dayjs, type Dayjs };

import dayjs, { Dayjs } from 'dayjs';
import { RangeDatePickerInputType, RangeDatePickerValue } from './types';

export const defaultFormat = 'MMM D, YYYY';
export const valueFormat = 'YYYY-MM-DD';

export const supportedDateFormats = (format?: string) => {
    return [
        ...(format ? [format] : []), 'MM/DD/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY', 'YYYY/MM/DD', 'YYYY-MM-DD', 'YYYY.MM.DD', 'MMM D, YYYY', 'D/M/YYYY', 'YYYY/M/D',
    ];
};

export const uuiDatePickerBodyBase = {
    container: 'uui-datepicker-container',
} as const;

export const getNewMonth = (value: string | Dayjs) => {
    return dayjs(value, valueFormat).isValid() ? dayjs(value, valueFormat) : dayjs().startOf('day');
};

export const defaultRangeValue: RangeDatePickerValue = {
    from: null,
    to: null,
};

export const getMonthOnOpening = (focus: RangeDatePickerInputType, selectedDate: RangeDatePickerValue) => {
    if (selectedDate?.from && selectedDate?.to) {
        return dayjs(selectedDate[focus]);
    } else if (selectedDate?.from) {
        return dayjs(selectedDate?.from);
    } else if (selectedDate?.to) {
        return dayjs(selectedDate?.to);
    } else {
        return dayjs();
    }
};

export const rangeIsEmpty = (range: RangeDatePickerValue) => {
    return !range.from && !range.to;
};

export const isValidRange = (range: RangeDatePickerValue) => {
    const from = dayjs(range.from);
    const to = dayjs(range.to);
    return from.isValid() && to.isValid()
        ? from.valueOf() <= to.valueOf() && to.valueOf() >= from.valueOf()
        : true;
};

export const getWithFrom = (selectedDate:RangeDatePickerValue, newValue: string) => {
    if (dayjs(newValue).valueOf() <= dayjs(selectedDate.to).valueOf()) {
        // update range
        return {
            from: newValue,
            to: selectedDate.to,
        };
    } else {
        // new range value
        return {
            from: newValue,
            to: null,
        };
    }
};

export const getWithTo = (selectedDate:RangeDatePickerValue, newValue: string) => {
    if (!selectedDate.from) {
        // started on "to" input
        return {
            from: null,
            to: newValue,
        };
    } else if (dayjs(newValue).valueOf() >= dayjs(selectedDate.from).valueOf()) {
        // range is valid
        return {
            from: selectedDate.from,
            to: newValue,
        };
    } else {
        // range is invalid
        return {
            from: newValue,
            to: null,
        };
    }
};

export const toValueDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;

    const fromObj = dayjs(from, supportedDateFormats(format), true);
    const toObj = dayjs(to, supportedDateFormats(format), true);

    return {
        from: from && fromObj.isValid() ? dayjs(from, supportedDateFormats(format), true).format(valueFormat) : null,
        to: to && toObj.isValid() ? dayjs(to, supportedDateFormats(format), true).format(valueFormat) : null,
    };
};

export const toCustomDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;
    const customFormat = format || defaultFormat;

    const fromObj = dayjs(from, supportedDateFormats(format), true);
    const toObj = dayjs(to, supportedDateFormats(format), true);

    return {
        from: from && fromObj.isValid() ? dayjs(from, supportedDateFormats(format), true).format(customFormat) : null,
        to: to && toObj.isValid() ? dayjs(to, supportedDateFormats(format), true).format(customFormat) : null,
    };
};

export const toValueDateFormat = (value: string, format?: string): string => {
    return value ? dayjs(value, supportedDateFormats(format), true).format(valueFormat) : null;
};

export const toCustomDateFormat = (value: string, format?: string): string => {
    const customFormat = format || defaultFormat;

    if (value) {
        const dayjsObj = dayjs(value, supportedDateFormats(format), true);

        if (dayjsObj.isValid()) {
            return dayjsObj.format(customFormat);
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export const getPrevMonth = (currentDate: Dayjs) => {
    return currentDate.subtract(1, 'month');
};

export const getNextMonth = (currentDate: Dayjs) => {
    return currentDate.add(1, 'month');
};

export const getPrevYear = (currentDate: Dayjs) => {
    return currentDate.subtract(1, 'year');
};

export const getNextYear = (currentDate: Dayjs) => {
    return currentDate.add(1, 'year');
};

export const getPrevYearsList = (currentDate: Dayjs) => {
    return currentDate.subtract(16, 'year');
};

export const getNextYearsList = (currentDate: Dayjs) => {
    return currentDate.add(16, 'year');
};

import { uuiDayjs, Dayjs } from '../../helpers/dayJsHelper';
import { RangeDatePickerInputType, RangeDatePickerValue } from '@epam/uui-core';

export const defaultFormat = 'MMM D, YYYY';
export const valueFormat = 'YYYY-MM-DD';

export const supportedDateFormats = (format?: string) => {
    return [
        ...(format ? [format] : []), 'MM/DD/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY', 'DDMMYYYY', 'YYYY/MM/DD', 'YYYY-MM-DD', 'YYYY.MM.DD', 'MMM D, YYYY', 'D/M/YYYY', 'YYYY/M/D',
    ];
};

export const uuiDatePickerBodyBase = {
    container: 'uui-datepicker-container',
} as const;

export const getNewMonth = (value: string | Dayjs | null) => {
    return uuiDayjs.dayjs(value, valueFormat).isValid() ? uuiDayjs.dayjs(value, valueFormat) : uuiDayjs.dayjs().startOf('day');
};

export const defaultRangeValue: RangeDatePickerValue = {
    from: null,
    to: null,
};

export const getMonthOnOpen = (selectedDate: RangeDatePickerValue, focus: RangeDatePickerInputType) => {
    if (selectedDate.from && selectedDate.to && focus) {
        return uuiDayjs.dayjs(selectedDate[focus]);
    } else if (selectedDate.from) {
        return uuiDayjs.dayjs(selectedDate?.from);
    } else if (selectedDate.to) {
        return uuiDayjs.dayjs(selectedDate?.to);
    }
    return uuiDayjs.dayjs();
};

export const isValidDate = (input: string | null, format: string, filter?:(day: Dayjs) => boolean): boolean | undefined => {
    const parsedDate = uuiDayjs.dayjs(input, supportedDateFormats(format), true);
    return filter ? parsedDate.isValid() && filter(parsedDate) : parsedDate.isValid();
};

export const isValidRange = (range: RangeDatePickerValue) => {
    const from = uuiDayjs.dayjs(range.from);
    const to = uuiDayjs.dayjs(range.to);
    return from.isValid() && to.isValid()
        ? from.valueOf() <= to.valueOf() && to.valueOf() >= from.valueOf()
        : true;
};

export const getWithFrom = (selectedDate: RangeDatePickerValue, newValue: string | null, preventEmpty: boolean) => {
    if (uuiDayjs.dayjs(newValue).valueOf() <= uuiDayjs.dayjs(selectedDate.to).valueOf()) {
        // update range
        return {
            from: newValue,
            to: selectedDate.to,
        };
    } else {
        // new range value
        return {
            from: newValue,
            to: preventEmpty ? newValue : null,
        };
    }
};

export const getWithTo = (selectedDate:RangeDatePickerValue, newValue: string | null, preventEmpty: boolean) => {
    if (!selectedDate.from) {
        // started on "to" input
        return {
            from: null,
            to: newValue,
        };
    } else if (uuiDayjs.dayjs(newValue).valueOf() >= uuiDayjs.dayjs(selectedDate.from).valueOf()) {
        // range is valid
        return {
            from: selectedDate.from,
            to: newValue,
        };
    } else {
        // range is invalid
        return {
            from: newValue,
            to: preventEmpty ? newValue : null,
        };
    }
};

export const toValueDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;

    const fromObj = uuiDayjs.dayjs(from, supportedDateFormats(format), true);
    const toObj = uuiDayjs.dayjs(to, supportedDateFormats(format), true);

    return {
        from: from && fromObj.isValid() ? uuiDayjs.dayjs(from, supportedDateFormats(format), true).format(valueFormat) : null,
        to: to && toObj.isValid() ? uuiDayjs.dayjs(to, supportedDateFormats(format), true).format(valueFormat) : null,
    };
};

export const toCustomDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;
    const customFormat = format || defaultFormat;

    const fromObj = uuiDayjs.dayjs(from, supportedDateFormats(format), true);
    const toObj = uuiDayjs.dayjs(to, supportedDateFormats(format), true);

    return {
        from: from && fromObj.isValid() ? uuiDayjs.dayjs(from, supportedDateFormats(format), true).format(customFormat) : null,
        to: to && toObj.isValid() ? uuiDayjs.dayjs(to, supportedDateFormats(format), true).format(customFormat) : null,
    };
};

export const toValueDateFormat = (value: string | null, format?: string): string | null => {
    return value ? uuiDayjs.dayjs(value, supportedDateFormats(format), true).format(valueFormat) : null;
};

export const toCustomDateFormat = (value: string | null, format?: string): string | null => {
    const customFormat = format || defaultFormat;
    const dayjsObj = uuiDayjs.dayjs(value, supportedDateFormats(format), true);
    return dayjsObj.isValid() ? dayjsObj.format(customFormat) : null;
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

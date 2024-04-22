import { dayJsHelper, Dayjs } from '../../helpers/dayJsHelper';
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

export const getNewMonth = (value: string | Dayjs | null) => {
    return dayJsHelper.dayjs(value, valueFormat).isValid() ? dayJsHelper.dayjs(value, valueFormat) : dayJsHelper.dayjs().startOf('day');
};

export const defaultRangeValue: RangeDatePickerValue = {
    from: null,
    to: null,
};

export const rangeIsEmpty = (range: RangeDatePickerValue) => {
    return !range.from && !range.to;
};

export const getValidMonth = (i: RangeDatePickerValue, focus: RangeDatePickerInputType, format: string, filter?: (day: Dayjs) => boolean) => {
    const fromValid = isValidDate(i.from, format, filter);
    const toValid = isValidDate(i.to, format, filter);
    if (fromValid && toValid && focus) {
        return dayJsHelper.dayjs(i[focus]);
    } else if (fromValid) {
        return dayJsHelper.dayjs(i.from);
    } else if (toValid) {
        return dayJsHelper.dayjs(i.to);
    }
};

export const getMonthOnOpen = (selectedDate: RangeDatePickerValue, focus: RangeDatePickerInputType) => {
    if (selectedDate.from && selectedDate.to && focus) {
        return dayJsHelper.dayjs(selectedDate[focus]);
    } else if (selectedDate.from) {
        return dayJsHelper.dayjs(selectedDate?.from);
    } else if (selectedDate.to) {
        return dayJsHelper.dayjs(selectedDate?.to);
    }
    return dayJsHelper.dayjs();
};

export const isValidDate = (input: string | null, format: string, filter?:(day: Dayjs) => boolean): boolean | undefined => {
    const parsedDate = dayJsHelper.dayjs(input, supportedDateFormats(format), true);
    return parsedDate.isValid() ?? filter?.(parsedDate) ?? true;
};

export const isValidRange = (range: RangeDatePickerValue) => {
    const from = dayJsHelper.dayjs(range.from);
    const to = dayJsHelper.dayjs(range.to);
    return from.isValid() && to.isValid()
        ? from.valueOf() <= to.valueOf() && to.valueOf() >= from.valueOf()
        : true;
};

export const getWithFrom = (selectedDate: RangeDatePickerValue, newValue: string | null) => {
    if (dayJsHelper.dayjs(newValue).valueOf() <= dayJsHelper.dayjs(selectedDate.to).valueOf()) {
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

export const getWithTo = (selectedDate:RangeDatePickerValue, newValue: string | null) => {
    if (!selectedDate.from) {
        // started on "to" input
        return {
            from: null,
            to: newValue,
        };
    } else if (dayJsHelper.dayjs(newValue).valueOf() >= dayJsHelper.dayjs(selectedDate.from).valueOf()) {
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

    const fromObj = dayJsHelper.dayjs(from, supportedDateFormats(format), true);
    const toObj = dayJsHelper.dayjs(to, supportedDateFormats(format), true);

    return {
        from: from && fromObj.isValid() ? dayJsHelper.dayjs(from, supportedDateFormats(format), true).format(valueFormat) : null,
        to: to && toObj.isValid() ? dayJsHelper.dayjs(to, supportedDateFormats(format), true).format(valueFormat) : null,
    };
};

export const toCustomDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;
    const customFormat = format || defaultFormat;

    const fromObj = dayJsHelper.dayjs(from, supportedDateFormats(format), true);
    const toObj = dayJsHelper.dayjs(to, supportedDateFormats(format), true);

    return {
        from: from && fromObj.isValid() ? dayJsHelper.dayjs(from, supportedDateFormats(format), true).format(customFormat) : null,
        to: to && toObj.isValid() ? dayJsHelper.dayjs(to, supportedDateFormats(format), true).format(customFormat) : null,
    };
};

export const toValueDateFormat = (value: string | null, format?: string): string | null => {
    return value ? dayJsHelper.dayjs(value, supportedDateFormats(format), true).format(valueFormat) : null;
};

export const toCustomDateFormat = (value: string | null, format?: string): string | null => {
    const customFormat = format || defaultFormat;
    const dayjsObj = dayJsHelper.dayjs(value, supportedDateFormats(format), true);
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

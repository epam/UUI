import dayjs from 'dayjs';
import { RangeDatePickerValue } from '@epam/uui-core';

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

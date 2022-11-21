import dayjs from "dayjs";
import { RangeDatePickerValue, defaultFormat, valueFormat, possibleDateFormats } from '..';

export const toValueDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;
    const customFormat = format || defaultFormat;

    return { from: from ? dayjs(from, possibleDateFormats, true).format(valueFormat) : null, to: to ? dayjs(to, possibleDateFormats, true).format(valueFormat) : to };
};

export const toCustomDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;
    const customFormat = format || defaultFormat;

    return { from: from ? dayjs(from, possibleDateFormats, true).format(customFormat) : null, to: to ? dayjs(to, possibleDateFormats, true).format(customFormat) : to };
};


export const toValueDateFormat = (value: string, format?: string): string => {

    return value ? dayjs(value, possibleDateFormats, true).format(valueFormat) : null;
};

export const toCustomDateFormat = (value: string, format?: string): string => {
    const customFormat = format || defaultFormat;

    return value ? dayjs(value, possibleDateFormats, true).format(customFormat) : null;
};


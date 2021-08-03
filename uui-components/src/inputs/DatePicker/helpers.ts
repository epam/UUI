import dayjs from "dayjs";
import { RangeDatePickerValue, defaultFormat, valueFormat } from '..';

export const toValueDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;
    const customFormat = format || defaultFormat;

    return { from: from ? dayjs(from, customFormat).format(valueFormat) : null, to: to ? dayjs(to, customFormat).format(valueFormat) : to };
};

export const toCustomDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;
    const customFormat = format || defaultFormat;

    return { from: from ? dayjs(from).format(customFormat) : null, to: to ? dayjs(to).format(customFormat) : to };
};


export const toValueDateFormat = (value: string, format?: string): string => {
    const customFormat = format || defaultFormat;

    return value ? dayjs(value, customFormat).format(valueFormat) : null;
};

export const toCustomDateFormat = (value: string, format?: string): string => {
    const customFormat = format || defaultFormat;

    return value ? dayjs(value).format(customFormat) : null;
};


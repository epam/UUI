import moment from 'moment';
import { RangeDatePickerValue, defaultFormat, valueFormat } from '..';

export const toValueDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;
    const customFormat = format || defaultFormat;

    return { from: from ? moment(from, customFormat).format(valueFormat) : null, to: to ? moment(to, customFormat).format(valueFormat) : to };
};

export const toCustomDateRangeFormat = (value: RangeDatePickerValue, format?: string): RangeDatePickerValue => {
    const from = value.from;
    const to = value.to;
    const customFormat = format || defaultFormat;

    return { from: from ? moment(from).format(customFormat) : null, to: to ? moment(to).format(customFormat) : to };
};


export const toValueDateFormat = (value: string, format?: string): string => {
    const customFormat = format || defaultFormat;

    return value ? moment(value, customFormat).format(valueFormat) : null;
};

export const toCustomDateFormat = (value: string, format?: string): string => {
    const customFormat = format || defaultFormat;

    return value ? moment(value).format(customFormat) : null;
};


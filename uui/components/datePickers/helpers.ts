import dayjs, { Dayjs } from 'dayjs';
import { valueFormat } from '@epam/uui-components';
import { RangeDatePickerInputType } from '@epam/uui-core';
import { RangeDatePickerValue } from './types';

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

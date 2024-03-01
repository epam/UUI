import dayjs, { Dayjs } from 'dayjs';
import { valueFormat } from '@epam/uui-components';
import { RangeDatePickerValue } from './RangeDatePickerBody';
import { RangeDatePickerInputType } from '@epam/uui-core';

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

import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, FlexRow } from '@epam/promo';

export default function DatePickerFilterExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow>
            <DatePicker
                value={value}
                onValueChange={onValueChange}
                format="MMM D, YYYY"
                filter={(day: Dayjs) => day.valueOf() >= dayjs().subtract(1, 'day').valueOf()}
            />
        </FlexRow>
    );
}

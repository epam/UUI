import React, { useState } from 'react';
import { RangeDatePicker, FlexRow } from '@epam/uui';
import dayjs, { Dayjs } from 'dayjs';

export default function DatePickerBaseExample() {
    const [value, onValueChange] = useState({ from: null, to: null });

    console.log('render basic example 11');
    return (
        <FlexRow>
            <RangeDatePicker
                value={ value }
                onValueChange={ onValueChange }
                format="MMM D, YYYY"
                filter={ (day: Dayjs) => {
                    return day.valueOf() >= dayjs('2023-12-22').subtract(0, 'day').valueOf();
                } }
            />
        </FlexRow>
    );
}

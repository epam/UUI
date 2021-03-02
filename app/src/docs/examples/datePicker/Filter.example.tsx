import React, { useState } from 'react';
import { DatePicker, FlexRow } from '@epam/promo';
import moment from "moment";

export const DatePickerFilterExample = () => {
    const [value, onValueChange] = useState('');

    return (
        <>
            <DatePicker
                value={ value }
                onValueChange={ onValueChange }
                format='MMM D, YYYY'
                filter={ (day: moment.Moment) => day.valueOf() >= moment().subtract(1, 'days').valueOf() }
            />
        </>
    );
};
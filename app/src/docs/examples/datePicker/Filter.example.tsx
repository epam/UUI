import React, { useState } from 'react';
import moment from 'moment';
import { DatePicker, FlexRow } from '@epam/promo';

export default function DatePickerFilterExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow>
            <DatePicker
                value={ value }
                onValueChange={ onValueChange }
                format='MMM D, YYYY'
                filter={ (day: moment.Moment) => day.valueOf() >= moment().subtract(1, 'days').valueOf() }
            />
        </FlexRow>
    );
};
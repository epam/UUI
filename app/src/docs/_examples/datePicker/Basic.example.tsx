import React, { useState } from 'react';
import { DatePicker, FlexRow } from '@epam/promo';

export default function DatePickerBaseExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow>
            <DatePicker value={ value } onValueChange={ onValueChange } format="MMM D, YYYY" />
        </FlexRow>
    );
}

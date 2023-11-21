import React, { useState } from 'react';
import { DatePicker, FlexRow } from '@epam/uui';

export default function DatePickerBaseExample() {
    const [value, onValueChange] = useState('');

    return (
        <FlexRow rawProps={ { style: { minWidth: '195px' } } }>
            <DatePicker value={ value } onValueChange={ onValueChange } format="MMM D, YYYY" />
        </FlexRow>
    );
}

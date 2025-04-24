import React, { useState } from 'react';
import { DatePicker, FlexRow } from '@epam/uui';

export default function DatePickerRreventEmptyExample() {
    const [value, onValueChange] = useState('24-04-2025');

    return (
        <FlexRow rawProps={ { style: { minWidth: '195px' } } }>
            <DatePicker value={ value } onValueChange={ onValueChange } preventEmpty={ true } format="MMM D, YYYY" />
        </FlexRow>
    );
}

import React, { useState } from 'react';
import { RangeDatePicker } from '@epam/uui';

export default function RangeDatePickerPreventEmptyExample() {
    const [value, onValueChange] = useState({ from: '2025-04-24', to: '2025-04-30' });

    return (
        <RangeDatePicker preventEmptyFromDate={ true } preventEmptyToDate={ true } value={ value } onValueChange={ onValueChange } format="MMM D, YYYY" />
    );
}

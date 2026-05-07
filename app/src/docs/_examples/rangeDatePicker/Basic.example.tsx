import React, { useState } from 'react';
import { RangeDatePicker } from '@epam/uui';

export default function RangeDatePickerBaseExample() {
    const [value, onValueChange] = useState({ from: null, to: null });

    return (
        <RangeDatePicker value={ value } onValueChange={ onValueChange } format="MMM D, YYYY" />
    );
}
